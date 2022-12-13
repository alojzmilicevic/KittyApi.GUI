import { EnhancedStore } from '@reduxjs/toolkit';
import { SimpleErrorResponse } from '../../errors/errorFactory';
import { BaseHubMessage, ClientType, IceCandidateMessage, MessageTypes, OfferMessage, Payload } from '../../common/signaling/constants';
import { SignalingChannel } from '../../common/signaling/signaling';
import {
    ConnectionStatus,
    getConnectionStatus,
    setError,
    setStreamInfo,
    getStreamInfo as getStreamInfoSelector,
    getUser,
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
            getUser(this.store.getState())!
        );
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

    onSocketMessage = async (message: Payload) => {
        const { sender } = message as BaseHubMessage;
        if (import.meta.env.VITE_DEBUG_LEVEL === 'debug') {
            console.log(`got ${message.type} from ${sender}`);
        }

        switch (message.type) {
            case MessageTypes.OFFER:
                const offerMessage = message as OfferMessage;
                await this.viewerPeerConnection.handleOffer({ type: message.type, sdp: offerMessage.sdp });
                break;
            case MessageTypes.ICE_CANDIDATE:
                const iceMessage = message as IceCandidateMessage;
                await this.viewerPeerConnection.onIceCandidate({ ...iceMessage });
                break;
        }
    };
}
