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
    stream: MediaStream | null = null;
    signaling: SignalingChannel | null;
    viewerPeerConnection: ViewerPeerConnection;
    streamId: string;
    logLevel = 'debug';

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

        this.getStreamInfo();
    }

    async getStreamInfo() {
        try {
            const streamInfo = await StreamService.getStreamInfo(this.streamId);
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
        if (this.signaling) {
            await this.signaling.init();
            const s = getStreamInfoSelector(this.store.getState());
            await this.viewerPeerConnection.connectToStream(s?.streamId!);
        } else {
            console.error('Error when connecting to stream, signaling is null');
        }
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
        if (this.logLevel === 'debug') {
            console.log(`got ${message.type} from ${user}`);
        }
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
