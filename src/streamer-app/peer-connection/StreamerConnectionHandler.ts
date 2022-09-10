import { EnhancedStore } from "@reduxjs/toolkit";
import { AppDispatch } from "../../store/store";
import { SignalingChannel } from "../../signaling/SignalingChannel";
import { ClientType, Message, MessageTypes } from "../../signaling/constants";
import { StreamerPeerConnection } from "./StreamerPeerConnection";
import { MediaConstraints } from "../../peerConnection/constants";
import { setStreamInfo } from '../../store/app';
import { getStreamInfo } from '../../viewer-app/api/stream';

export default class StreamerConnectionHandler {
    store: EnhancedStore;
    dispatch: AppDispatch;
    stream: MediaStream | null = null;
    signaling: SignalingChannel;
    streamerPeerConnection: StreamerPeerConnection;

    constructor(store: EnhancedStore) {
        this.store = store;
        this.dispatch = store.dispatch;
        this.signaling = new SignalingChannel(this.onSocketMessage, ClientType.STREAMER);
        this.streamerPeerConnection = new StreamerPeerConnection(store, this.dispatch, this.signaling);
        // Even though im awaiting functions inside the initClient function the constructor will still be completed.
        // This means that people using functions exposed inside this class can do so even if this class isn't ready.
        // Use Readiness Design Patter to fix this
        this.initClient();
    }

    async initClient() {
        this.stream = await navigator.mediaDevices.getUserMedia(MediaConstraints);
        this.setLocalVideo(this.stream);
        const streamInfo = await getStreamInfo(1);
        this.dispatch(setStreamInfo(streamInfo));
    }

    setLocalVideo = (stream: MediaStream | null) => {
        const elementId = 'streamer-video';
        let video: HTMLVideoElement = document.getElementById(elementId) as HTMLVideoElement;
        video.srcObject = stream;
    }

    async cleanUpConnection() {
        await this.signaling.cleanUpConnection();
    }

    async onUserLeftStream(user: string) {
        await this.streamerPeerConnection.onUserLeftStream(user);
    }

    onSocketMessage = async (user: string, message: Message) => {
        console.log(`got ${message.type} from ${user}`)
        switch (message.type) {
            case MessageTypes.INCOMING_CALL:
                await this.streamerPeerConnection.onIncomingCall(user, this.stream!);
                break;
            case MessageTypes.ANSWER:
                await this.streamerPeerConnection.onAnswer(user, message.payload as RTCSessionDescriptionInit);
                break;
            case MessageTypes.HANGUP:
                await this.onUserLeftStream(user);
                break;
        }
    }
}
