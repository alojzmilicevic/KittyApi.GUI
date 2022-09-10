export enum IceConnectionStates {
    CONNECTED = 'connected',
    DISCONNECTED = 'disconnected',
    CHECKING = 'checking',
    NEW = 'new',
    FAILED = 'failed'
}

export const IceServerConfig = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }

export const MediaConstraints: MediaStreamConstraints = {
    video: {
        width: {
            min: 640, ideal: 1280, max: 1920,
        },
        height: {
            min: 480, ideal: 720, max: 1080,
        },
        aspectRatio: 1.777777778
    },
    audio: false
}
