import { IceConnectionStates } from "./constants";

export const VIDEO_ID = "local-video";

export const onIceConnectionStateChange = (onDisconnect: () => void | Promise<void>, pc: RTCPeerConnection) => {
    pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === IceConnectionStates.DISCONNECTED) {
            onDisconnect();
        }
    }
}

export const setLocalVideo = (stream: MediaStream | null) => {
    let video: HTMLVideoElement = document.getElementById(VIDEO_ID) as HTMLVideoElement;

    if (video) video.srcObject = stream;
}
