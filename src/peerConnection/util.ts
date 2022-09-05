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
