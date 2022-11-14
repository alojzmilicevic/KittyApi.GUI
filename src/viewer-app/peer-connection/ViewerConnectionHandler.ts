import { EnhancedStore } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store/store';
import { SignalingChannel } from '../../signaling/SignalingChannel';
import { ClientType, Message, MessageTypes } from '../../signaling/constants';
import { ViewerPeerConnection } from './ViewerPeerConnection';
import { getStreamInfo } from '../api/stream';
import {
    ConnectionStatus,
    getConnectionStatus,
    setStreamInfo,
} from '../../store/app';
import { AxiosError } from 'axios';
import { ErrorResponse } from '../../errors/errorFactory';

export default class ViewerConnectionHandler {
    store: EnhancedStore;
    dispatch: AppDispatch;
    stream: MediaStream | null = null;
    signaling: SignalingChannel | null;
    viewerPeerConnection: ViewerPeerConnection;
    streamId: string;
    constructor(store: EnhancedStore, streamId: string) {
        this.store = store;
        this.dispatch = store.dispatch;
        this.streamId = streamId;
        this.signaling = new SignalingChannel(
            this.onSocketMessage,
            ClientType.VIEWER,
            false
        );
        this.viewerPeerConnection = new ViewerPeerConnection(
            store,
            this.dispatch,
            this.signaling
        );

        this.init(streamId);
    }

    async init(streamId: string) {
        try {
            const streamInfo = await getStreamInfo(streamId);
            this.dispatch(setStreamInfo(streamInfo));
        } catch (e: unknown) {
            if (e instanceof AxiosError<ErrorResponse>) {
                console.log(e.response?.data);
            }
        }
    }

    async cleanUpConnection() {
        await this.leaveStream();
    }

    async connectToStream() {
        this.signaling && (await this.signaling.init());
        await this.viewerPeerConnection.connectToStream(this.streamId);
    }

    async leaveStream() {
        await this.signaling?.cleanUpConnection();
        await this.viewerPeerConnection.leaveStream();
    }

    async logout() {
        const streamState = getConnectionStatus(this.store.getState());
        if (streamState !== ConnectionStatus.IDLE) {
            await this.leaveStream();
        }
    }

    onSocketMessage = async (user: string, message: Message) => {
        console.log(`got ${message.type} from ${user}`)
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
    };
}
