import { EnhancedStore } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store/store';
import { SignalingChannel } from '../../signaling/SignalingChannel';
import { MessageTypes } from '../../signaling/constants';
import { IceServerConfig } from '../../peer-connection/constants';
import { onIceConnectionStateChange } from '../../peer-connection/util';
import { getStreamInfo } from '../../viewer-app/api/stream';
import { setStreamInfo } from '../../store/app';

export class StreamerPeerConnection {
    pcs: { from: string, pc: RTCPeerConnection } [] = [];
    store: EnhancedStore;
    dispatch: AppDispatch;
    signaler: SignalingChannel;

    constructor(store: EnhancedStore, dispatch: AppDispatch, signaler: SignalingChannel) {
        this.store = store;
        this.dispatch = dispatch;
        this.signaler = signaler;
    }

    async onUserLeftStream(user: string) {
        const actualConn = this.pcs.find(x => x.from === user);
        actualConn?.pc.close();
        this.pcs = this.pcs.filter(x => x.from !== user);
        const streamInfo = await getStreamInfo("1");
        this.dispatch(setStreamInfo(streamInfo));
    }

    async onIncomingCall(user: string, mediaStream: MediaStream) {
        const pc = new RTCPeerConnection(IceServerConfig);

        pc.onicecandidate = async (ev: RTCPeerConnectionIceEvent) => {
            if (ev.candidate) {
                await this.signaler.sendMessageToViewer({
                    type: MessageTypes.ICE_CANDIDATE,
                    payload: ev.candidate
                }, user);
            }
        }

        onIceConnectionStateChange(() => this.onUserLeftStream(user), pc);

        mediaStream.getTracks().forEach(track => pc?.addTrack(track, mediaStream));

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await this.signaler.sendMessageToViewer(offer, user);
        this.pcs.push({ pc, from: user });
        const streamInfo = await getStreamInfo("1");
        this.dispatch(setStreamInfo(streamInfo));
    }

    async onAnswer(user: string, sdp: RTCSessionDescriptionInit) {
        const actualConn = this.pcs.find(x => x.from === user);
        await actualConn?.pc.setRemoteDescription(sdp);
    }
}
