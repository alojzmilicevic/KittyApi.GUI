import { EnhancedStore } from '@reduxjs/toolkit';
import { MediaConstraints } from '../../peer-connection/constants';
import { setLocalVideo } from '../../peer-connection/util';
import * as StreamService from '../../services/streamService';
import { ClientType, Message, MessageTypes } from '../../signaling/constants';
import { SignalingChannel } from '../../signaling/signaling';
import {
    ConnectionStatus,
    getStreamInfo,
    getUser,
    setConnectionStatus,
    setStreamInfo,
} from '../../store/app';
import { AppDispatch } from '../../store/store';
import { StartStreamInput } from '../interface';
import * as StreamerApi from '../service/streamerService';
import { StreamerPeerConnection } from './peerCon';

export default class StreamerConnectionHandler {
    store: EnhancedStore;
    dispatch: AppDispatch;
    stream: MediaStream | null = null;
    signaling: SignalingChannel;
    streamerPeerConnection: StreamerPeerConnection;

    constructor(store: EnhancedStore) {
        this.store = store;
        this.dispatch = store.dispatch;
        this.signaling = new SignalingChannel(
            this.onSocketMessage,
            ClientType.STREAMER,
            false
        );
        this.streamerPeerConnection = new StreamerPeerConnection(
            store,
            this.dispatch,
            this.signaling
        );
        // Even though im awaiting functions inside the initClient function the constructor will still be completed.
        // This means that people using functions exposed inside this class can do so even if this class isn't ready.
        // Use Readiness Design Patter to fix this
        this.initClient();
    }

    async initClient() {
        this.stream = await navigator.mediaDevices.getUserMedia(
            MediaConstraints
        );
        setLocalVideo(this.stream);
    }

    async startStream({ title, thumbnail }: StartStreamInput) {
        this.dispatch(
            setConnectionStatus({
                connectionStatus: ConnectionStatus.CONNECTING,
            })
        );

        try {
            const stream = await StreamerApi.startStream(title, thumbnail);
            this.signaling.init();
            this.dispatch(setStreamInfo(stream));
            this.dispatch(
                setConnectionStatus({
                    connectionStatus: ConnectionStatus.CONNECTED,
                })
            );
        } catch (error) {
            setConnectionStatus({
                connectionStatus: ConnectionStatus.IDLE,
            });
        }
    }

    async endStream() {
        this.dispatch(
            setConnectionStatus({
                connectionStatus: ConnectionStatus.CONNECTING,
            })
        );

        try {
            const streamId = getStreamInfo(this.store.getState())?.streamId;
            if (streamId) {
                await StreamerApi.endStream(streamId);
                this.cleanUpConnection();
                this.dispatch(
                    setConnectionStatus({
                        connectionStatus: ConnectionStatus.IDLE,
                    })
                );
                this.dispatch(setStreamInfo(undefined));
            }
        } catch (error) {
            console.error(error);
        }
    }

    async cleanUpConnection() {
        this.stream?.getTracks()[0].stop();
        await this.signaling.cleanUpConnection();
    }

    async onUserLeftStream(user: string) {
        await this.streamerPeerConnection.onUserLeftStream(user);
    }

    logout() { }

    onSocketMessage = async (user: string, message: Message) => {
        //console.log(`got ${message.type} from ${user}`);
        switch (message.type) {
            case MessageTypes.INCOMING_CALL:
                await this.streamerPeerConnection.onIncomingCall(
                    user,
                    this.stream!
                );

                const streamId = getUser(this.store.getState())?.username;
                const streamInfo = await StreamService.getStreamInfo(streamId!);
                this.dispatch(setStreamInfo(streamInfo));
                break;
            case MessageTypes.ANSWER:
                await this.streamerPeerConnection.onAnswer(
                    user,
                    message.payload as RTCSessionDescriptionInit
                );
                break;
            case MessageTypes.HANGUP:
                await this.onUserLeftStream(user);
                break;
        }
    };
}
