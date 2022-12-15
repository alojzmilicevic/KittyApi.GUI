import { Stream } from "../../viewer-app/interface";

export enum MessageTypes {
    INCOMING_CALL = 'incomingCall',
    ANSWER = 'answer',
    HANGUP = 'hangup',
    ICE_CANDIDATE = 'iceCandidate',
    OFFER = 'offer',
    STREAMS_UPDATED = 'streamsUpdated',
}

export enum ClientType {
    VIEWER = 'viewer',
    STREAMER = 'streamer',
}

export enum Hubs {
    ReceiveMessage = 'ReceiveMessage',
}

export interface BaseHubMessage {
    sender: string,
    receiver: string,
}

export type Payload = IncomingCallMessage | LeaveStreamMessage | OfferMessage | IceCandidateMessage | AnswerMessage;

export interface IncomingCallMessage extends BaseHubMessage {
    type: MessageTypes,
}
export interface LeaveStreamMessage {
    type: MessageTypes,
}

export interface OfferMessage extends BaseHubMessage {
    type: MessageTypes,
    sdp: string,
}

export interface AnswerMessage extends BaseHubMessage {
    type: MessageTypes,
    sdp: string,
}

export interface IceCandidateMessage extends BaseHubMessage {
    type: MessageTypes,
    candidate: string,
    sdpMid: string | null,
    sdpMLineIndex: number | null,
}

export interface StreamsUpdatedMessage extends BaseHubMessage {
    type: MessageTypes,
    streams: Stream[],
}

export type PartialIceCandidateMessage = Omit<IceCandidateMessage, 'type' | 'sender'>
export type PartialAnswerMessage = Omit<AnswerMessage, 'type' | 'sender' | 'receiver'>
export type PartialOfferMessage = Omit<OfferMessage, 'type' | 'sender'>

export enum Hubmethod {
    SEND_OFFER = "SendOfferMessage",
    SEND_ANSWER = "SendAnswerMessage",
    SEND_ICE_CANDIDATE = "SendIceCandidateMessage",
}
