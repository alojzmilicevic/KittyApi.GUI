export enum IceConnectionStates {
    CONNECTED = 'connected',
    DISCONNECTED = 'disconnected',
    CHECKING = 'checking',
    NEW = 'new',
    FAILED = 'failed'
}

export const IceServerConfig = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }

export const MediaConstraints = {
    video: {
        width: 640,
        height: 480,
    },
    audio: false
}
