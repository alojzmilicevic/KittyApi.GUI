import { IceConnectionStates } from "./constants";

export const onIceConnectionStateChange = (onDisconnect: () => void | Promise<void>, pc: RTCPeerConnection) => {
    pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === IceConnectionStates.CONNECTED) {

        }
        if (pc.iceConnectionState === IceConnectionStates.DISCONNECTED) {
            onDisconnect();
        }
    }
}

export const setLocalVideo = (stream: MediaStream | null) => {
    const elementId = 'localvideo';
    let video: HTMLVideoElement = document.getElementById(elementId) as HTMLVideoElement;

    if (video) video.srcObject = stream;
}
