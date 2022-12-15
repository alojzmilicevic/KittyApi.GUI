import { EnhancedStore } from '@reduxjs/toolkit';
import { SimpleErrorResponse } from '../../errors/errorFactory';
import { BaseHubMessage, ClientType, IceCandidateMessage, MessageTypes, OfferMessage, Payload, StreamsUpdatedMessage } from '../../common/signaling/constants';
import { SignalingChannel } from '../../common/signaling/signaling';
import {
    ConnectionStatus,
    getConnectionStatus,
    setError,
    setStreamInfo,
    getStreamInfo as getStreamInfoSelector,
    getUser,
    setAppStatus,
    AppStatus,
    setStreams,
} from '../../store/app';
import { AppDispatch } from '../../store/store';
import * as StreamService from '../../services/streamService';
import * as ViewerService from '../service/viewerService';
import { ViewerPeerConnection } from './viewerPeerCon';

export default class ViewerConnectionHandler {
    store: EnhancedStore;
    dispatch: AppDispatch;
    signaling: SignalingChannel | null;
    viewerPeerConnection: ViewerPeerConnection;

    constructor(store: EnhancedStore) {
        this.store = store;
        this.dispatch = store.dispatch;
        this.setAppStatus(AppStatus.INITIALIZING);

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

        this.setAppStatus(AppStatus.INITIALIZED);
        this.fetchAllStreams();
    }

    async fetchAllStreams() {
        this.dispatch(setAppStatus(AppStatus.FETCHING_STREAMS));
        const streams = await ViewerService.getStreams();
        this.dispatch(setStreams(streams));
    }

    setAppStatus(appStatus: AppStatus) {
        this.dispatch(setAppStatus(appStatus));
    }

    async getStreamInfo(streamId: string) {
        this.setAppStatus(AppStatus.FETCHING_STREAM_INFO)
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
        this.setAppStatus(AppStatus.FETCHED_STREAM_INFO);
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

            case MessageTypes.STREAMS_UPDATED:
                const streamCreatedMessage = message as StreamsUpdatedMessage;
                this.dispatch(setStreams(streamCreatedMessage.streams));
                break;

        }
    };
}
