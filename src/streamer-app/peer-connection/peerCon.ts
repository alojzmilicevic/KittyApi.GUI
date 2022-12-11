import { EnhancedStore } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store/store';
import { SignalingChannel } from '../../common/signaling/signaling';
import { MessageTypes } from '../../common/signaling/constants';
import { IceServerConfig } from '../../common/peer-connection/constants';
import { onIceConnectionStateChange } from '../../common/peer-connection/util';
import { getUser, setStreamInfo } from '../../store/app';
import * as StreamService from '../../services/streamService';

export class StreamerPeerConnection {
    pcs: { from: string; pc: RTCPeerConnection }[] = [];
    store: EnhancedStore;
    dispatch: AppDispatch;
    signaler: SignalingChannel;

    constructor(
        store: EnhancedStore,
        dispatch: AppDispatch,
        signaler: SignalingChannel
    ) {
        this.store = store;
        this.dispatch = dispatch;
        this.signaler = signaler;
    }

    async onUserLeftStream(user: string) {
        const actualConn = this.pcs.find((x) => x.from === user);
        actualConn?.pc.close();
        this.pcs = this.pcs.filter((x) => x.from !== user);

        const streamId = getUser(this.store.getState())?.username;
        const streamInfo = await StreamService.getStreamInfo(streamId!);
        this.dispatch(setStreamInfo(streamInfo));
    }

    async onIncomingCall(user: string, mediaStream: MediaStream) {
        const pc = new RTCPeerConnection(IceServerConfig);

        pc.onicecandidate = async (ev: RTCPeerConnectionIceEvent) => {
            if (ev.candidate) {
                // TODO need to make sure that answer has been received before sending ice candidate
                await this.signaler.sendMessageToViewer(
                    {
                        type: MessageTypes.ICE_CANDIDATE,
                        payload: ev.candidate,
                    },
                    user
                );
            }
        };

        onIceConnectionStateChange(() => this.onUserLeftStream(user), pc);

        mediaStream
            .getTracks()
            .forEach((track) => pc?.addTrack(track, mediaStream));

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await this.signaler.sendMessageToViewer(offer, user);
        this.pcs.push({ pc, from: user });
    }

    async onAnswer(user: string, sdp: RTCSessionDescriptionInit) {
        const actualConn = this.pcs.find((x) => x.from === user);
        await actualConn?.pc.setRemoteDescription(sdp);
    }

    async cleanUp() {
        this.pcs.forEach((x) => x.pc.close());
        this.pcs = [];
    }
}
