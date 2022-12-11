import { EnhancedStore } from '@reduxjs/toolkit';
import { SimpleErrorResponse } from '../../errors/errorFactory';
import { ClientType, Message, MessageTypes } from '../../common/signaling/constants';
import { SignalingChannel } from '../../common/signaling/signaling';
import {
    ConnectionStatus,
    getConnectionStatus,
    setError,
    setStreamInfo,
    getStreamInfo as getStreamInfoSelector,
} from '../../store/app';
import { AppDispatch } from '../../store/store';
import * as StreamService from '../../services/streamService';
import { ViewerPeerConnection } from './viewerPeerCon';

export default class ViewerConnectionHandler {
    store: EnhancedStore;
    dispatch: AppDispatch;
    signaling: SignalingChannel | null;
    viewerPeerConnection: ViewerPeerConnection;

    constructor(store: EnhancedStore) {
        this.store = store;
        this.dispatch = store.dispatch;

        this.signaling = new SignalingChannel(
            this.onSocketMessage,
            ClientType.VIEWER,
        );
        this.signaling.init();
        this.viewerPeerConnection = new ViewerPeerConnection(
            store,
            this.dispatch,
            this.signaling
        );
    }

    async getStreamInfo(streamId: string) {
        try {
            const streamInfo = await StreamService.getStreamInfo(streamId);
            this.dispatch(setStreamInfo(streamInfo));
        } catch (e: unknown) {
            let error = e as SimpleErrorResponse;

            this.dispatch(
                setError({
                    error: {
                        message: error.message,
                        type: error.type,
                    },
                    action: '/',
                    label: 'Return to streams overview',
                })
            );
        }
    }

    async connectToStream() {
        const streamState = getConnectionStatus(this.store.getState());
        if (streamState !== ConnectionStatus.IDLE) {
            return;
        }
        if (this.signaling) {
            const streamInfo = getStreamInfoSelector(this.store.getState());
            await this.viewerPeerConnection.connectToStream(streamInfo?.streamId!);
        } else {
            console.error('Error when connecting to stream, signaling is null');
        }
    }

    async cleanUp() {
        await this.leaveStream();
        this.signaling?.cleanUpConnection();
    }


    async leaveStream() {
        if (this.viewerPeerConnection.peer) {
            await this.viewerPeerConnection.leaveStream();
        }
    }

    async logout() {
        const streamState = getConnectionStatus(this.store.getState());
        if (streamState !== ConnectionStatus.IDLE) {
            await this.leaveStream();
        }
    }

    onSocketMessage = async (user: string, message: Message) => {
        if (import.meta.env.VITE_DEBUG_LEVEL === 'debug') {
            console.log(`got ${message.type} from ${user}`);
        }
        switch (message.type) {
            case MessageTypes.OFFER:
                await this.viewerPeerConnection.handleOffer(message);
                break;
            case MessageTypes.ICE_CANDIDATE:
                await this.viewerPeerConnection.onIceCandidate(message.payload);
                break;
        }
    };
}
