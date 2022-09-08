import { EnhancedStore } from "@reduxjs/toolkit";
import { AppDispatch } from "../../store/store";
import { SignalingChannel } from "../../signaling/SignalingChannel";
import { ClientType, Message, MessageTypes } from "../../signaling/constants";
import { ViewerPeerConnection } from "./ViewerPeerConnection";
import { getStreamInfo } from "../api/stream";
import { setStreamInfo } from '../../store/app';

export default class ViewerConnectionHandler {
    store: EnhancedStore;
    dispatch: AppDispatch;
    stream: MediaStream | null = null;
    signaling: SignalingChannel;
    viewerPeerConnection: ViewerPeerConnection;

    constructor(store: EnhancedStore) {
        this.store = store;
        this.dispatch = store.dispatch;
        this.signaling = new SignalingChannel(this.onSocketMessage, ClientType.VIEWER);
        this.viewerPeerConnection = new ViewerPeerConnection(store, this.dispatch, this.signaling);

        this.init();
    }

    async init() {
        const streamInfo = await getStreamInfo(1);
        this.dispatch(setStreamInfo(streamInfo));
    }

    async cleanUpConnection() {
        await this.leaveStream();
        await this.signaling.cleanUpConnection();
    }

    async connectToStream() {
        await this.viewerPeerConnection.connectToStream();
    }

    async leaveStream() {
        await this.viewerPeerConnection.leaveStream();
    }

    onSocketMessage = async (user: string, message: Message) => {
        //console.log(`got ${message.type} from ${user}`)
        switch (message.type) {
            case MessageTypes.CALL:
                await this.connectToStream();
                break;
            case MessageTypes.OFFER:
                await this.viewerPeerConnection.handleOffer(message);
                break;
            case MessageTypes.ICE_CANDIDATE:
                await this.viewerPeerConnection.onIceCandidate(message.payload);
                break;
        }
    }
}
