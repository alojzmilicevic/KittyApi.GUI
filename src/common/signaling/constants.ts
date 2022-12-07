export enum MessageTypes {
    INCOMING_CALL = 'incomingCall',
    ANSWER = 'answer',
    HANGUP = 'hangup',
    ICE_CANDIDATE = 'iceCandidate',
    OFFER = 'offer',
}

export enum ClientType {
    VIEWER = 'viewer',
    STREAMER = 'streamer',
}

type PayloadType = {} | RTCSessionDescriptionInit;

export interface Message {
    type: MessageTypes,
    payload: PayloadType
}

export enum SignalRMessageTypes {
    SEND_MESSAGE_TO_STREAMER = "SendMessageToStreamer",
    SEND_MESSAGE_TO_VIEWER_BASED_ON_USER_NAME = "SendMessageToViewerBasedOnUserName",
}
