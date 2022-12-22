import { EnhancedStore } from "@reduxjs/toolkit";
import { IceServerConfig } from "../../common/peer-connection/constants";
import {
    onIceConnectionStateChange,
    setLocalVideo,
} from "../../common/peer-connection/util";
import { SignalingChannel } from "../../common/signaling/signaling";
import {
    AppStatus,
    ConnectionStatus,
    getStreamInfo as getStreamInfoSelector,
    getUser,
    setAppStatus,
    setConnectionStatus,
    setStreamInfo,
} from "../../store/app";
import { AppDispatch } from "../../store/store";
import * as ViewerService from "../service/viewerService";

export class ViewerPeerConnection {
    peer: { from: string; pc: RTCPeerConnection } | null = null;
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

    leaveStream = async () => {
        setLocalVideo(null);
        this.peer?.pc.close();
        this.peer = null;

        try {
            const streamInfo = getStreamInfoSelector(this.store.getState());
            if(streamInfo) {
                await ViewerService.leaveStream(streamInfo.streamId);
            }
        } catch (e) {
            console.error(e);
        } finally {
            this.dispatch(
                setConnectionStatus({ connectionStatus: ConnectionStatus.IDLE })
            );
            this.dispatch(setAppStatus(AppStatus.INITIALIZED));
            this.dispatch(setStreamInfo(undefined));
            window.location.replace("/");
        }
    };

    async connectToStream(streamId: string) {
        if (this.peer) return;

        this.dispatch(
            setConnectionStatus({
                connectionStatus: ConnectionStatus.CONNECTING,
            })
        );

        const pc = new RTCPeerConnection(IceServerConfig);
        const user = getUser(this.store.getState())!;
        this.peer = { from: user.userId, pc };

        onIceConnectionStateChange(() => this.leaveStream(), pc);

        pc.onconnectionstatechange = () => {
            switch (pc.connectionState) {
                case "connecting":
                    break;

                case "connected":
                    this.dispatch(
                        setConnectionStatus({
                            connectionStatus: ConnectionStatus.CONNECTED,
                        })
                    );
                    break;

                case "disconnected":
                case "failed":
                case "closed":
                    this.leaveStream();
            }
        };
        pc.ontrack = (ev: RTCTrackEvent) => setLocalVideo(ev.streams[0]);

        await ViewerService.joinStream(streamId);
    }

    async handleOffer(message: RTCSessionDescriptionInit) {
        const sdp = new RTCSessionDescription(message);
        const pc = this.peer?.pc;
        if (!pc) {
            console.error(
                "Unable to handle offer, PeerConnection not yet created!"
            );
            return;
        }

        await pc.setRemoteDescription(sdp);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        await this.signaler.sendAnswer({ sdp: answer.sdp! });
    }

    async onIceCandidate(iceCandidate: RTCIceCandidateInit) {
        if (this.peer?.pc) {
            await this.peer?.pc.addIceCandidate(iceCandidate);
        } else {
            console.error(
                "Unable to handle ice candidates PeerConnection not yet created!"
            );
        }
    }
}
