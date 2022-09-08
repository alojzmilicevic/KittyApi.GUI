import { MessageTypes } from "../../signaling/constants";
import { EnhancedStore } from "@reduxjs/toolkit";
import { AppDispatch } from "../../store/store";
import { SignalingChannel } from "../../signaling/SignalingChannel";
import { IceServerConfig } from "../../peerConnection/constants";
import { onIceConnectionStateChange } from "../../peerConnection/util";
import { ConnectionStatus, setConnectionStatus, setStreamInfo } from '../../store/app';
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

        this.setLocalVideo(null);
        this.peer.pc.close();
        this.peer = null;
        const streamInfo = await StreamApi.leaveStream(this.signaler.getConnectionId()!);
        //await this.signaler.sendMessageToStreamer({ type: MessageTypes.HANGUP, payload: {} });
        this.dispatch(setConnectionStatus({connectionStatus: ConnectionStatus.IDLE}));
        this.dispatch(setStreamInfo(streamInfo));
    };

    setLocalVideo = (stream: MediaStream | null) => {
        const elementId = 'viewer-video';
        let video: HTMLVideoElement = document.getElementById(elementId) as HTMLVideoElement;

        if (video) video.srcObject = stream;
    }

    async connectToStream() {
        if (this.peer) return;
        this.dispatch(setConnectionStatus({ connectionStatus: ConnectionStatus.CONNECTING }));

        const pc = new RTCPeerConnection(IceServerConfig);
        this.peer = { from: this.signaler.getConnectionId()!, pc };

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
        pc.ontrack = (ev: RTCTrackEvent) => this.setLocalVideo(ev.streams[0]);

        await StreamApi.joinStream(this.signaler.getConnectionId()!);
        //await this.signaler.sendMessageToStreamer({ type: MessageTypes.INCOMING_CALL, payload: {} })
    }

    async handleOffer(message: any) {
        const sdp = new RTCSessionDescription(message);
        const pc = this.peer?.pc;
        if (!pc) return;
        // TODO what happens if pc is null
        await pc.setRemoteDescription(sdp);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        await this.signaler.sendMessageToStreamer({ type: MessageTypes.ANSWER, payload: answer });
    }

    async onIceCandidate(iceCandidate: any) {
        // TODO what happens if pc is null
        await this.peer?.pc.addIceCandidate(iceCandidate);
    }
}
