import { MessageTypes } from "../../signaling/constants";
import { EnhancedStore } from "@reduxjs/toolkit";
import { AppDispatch } from "../../store/store";
import { SignalingChannel } from "../../signaling/SignalingChannel";
import { IceServerConfig } from "../../peerConnection/constants";
import { onIceConnectionStateChange, setLocalVideo } from '../../peerConnection/util';
import { ConnectionStatus, getUser, setConnectionStatus, setStreamInfo } from '../../store/app';
import * as StreamApi from "../api/stream";

export class ViewerPeerConnection {
    peer: { from: string, pc: RTCPeerConnection } | null = null;
    store: EnhancedStore;
    dispatch: AppDispatch;
    signaler: SignalingChannel;

    constructor(store: EnhancedStore, dispatch: AppDispatch, signaler: SignalingChannel) {
        this.store = store;
        this.dispatch = dispatch;
        this.signaler = signaler;
    }

    leaveStream = async () => {
        if (!this.peer) return;

        setLocalVideo(null);
        this.peer.pc.close();
        this.peer = null;
        const streamInfo = await StreamApi.leaveStream();
        this.dispatch(setConnectionStatus({connectionStatus: ConnectionStatus.IDLE}));
        this.dispatch(setStreamInfo(streamInfo));
    };

    async connectToStream() {
        if (this.peer) return;
        this.dispatch(setConnectionStatus({ connectionStatus: ConnectionStatus.CONNECTING }));

        const pc = new RTCPeerConnection(IceServerConfig);
        const user = getUser(this.store.getState())!;
        this.peer = { from: user.username, pc };

        onIceConnectionStateChange(() => this.leaveStream(), pc);

        pc.onconnectionstatechange = (ev) => {
            switch (pc.connectionState) {
                case "connecting":
                    break;

                case "connected":
                    this.dispatch(setConnectionStatus({ connectionStatus: ConnectionStatus.CONNECTED }));
                    break;
            }
        }
        pc.ontrack = (ev: RTCTrackEvent) => setLocalVideo(ev.streams[0]);

        await StreamApi.joinStream();
    }

    async handleOffer(message: any) {
        const sdp = new RTCSessionDescription(message);
        const pc = this.peer?.pc;
        if (!pc) return;
        // TODO what happens if pc is null
        await pc.setRemoteDescription(sdp);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        const user = getUser(this.store.getState())!;

        await this.signaler.sendMessageToStreamer({ type: MessageTypes.ANSWER, payload: answer }, user.username);
    }

    async onIceCandidate(iceCandidate: any) {
        // TODO what happens if pc is null
        await this.peer?.pc.addIceCandidate(iceCandidate);
    }
}