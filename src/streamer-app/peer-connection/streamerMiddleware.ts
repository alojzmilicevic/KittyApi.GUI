import { EnhancedStore } from '@reduxjs/toolkit';
import { MediaConstraints } from '../../common/peer-connection/constants';
import { setLocalVideo } from '../../common/peer-connection/util';
import * as StreamService from '../../services/streamService';
import { ClientType, Message, MessageTypes } from '../../common/signaling/constants';
import { SignalingChannel } from '../../common/signaling/signaling';
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
        );
        this.streamerPeerConnection = new StreamerPeerConnection(
            store,
            this.dispatch,
            this.signaling
        );
        this.signaling.init();

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

            }

        } catch (error) {
            console.error(error);
        } finally {
            this.dispatch(
                setConnectionStatus({
                    connectionStatus: ConnectionStatus.IDLE,
                })
            );
            this.dispatch(setStreamInfo(undefined));
        }
    }

    async cleanUp() {
        this.stream?.getTracks()[0].stop();
        this.stream = null;
        await this.signaling.cleanUpConnection();
        await this.streamerPeerConnection.cleanUp();
        this.endStream();
    }

    async onUserLeftStream(user: string) {
        await this.streamerPeerConnection.onUserLeftStream(user);
    }

    logout() {
        this.cleanUp();
    }

    onSocketMessage = async (user: string, message: Message) => {
        if (import.meta.env.VITE_DEBUG_LEVEL === 'debug') {
            if (message.type !== MessageTypes.OFFER && message.type !== MessageTypes.ICE_CANDIDATE) {
                console.log(`got ${message.type} from ${user}`);
            }
        }
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
