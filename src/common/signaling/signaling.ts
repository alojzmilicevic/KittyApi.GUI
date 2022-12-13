import {
    HttpTransportType,
    HubConnection,
    HubConnectionBuilder, LogLevel
} from '@microsoft/signalr';
import { UserModel } from '../../user/UserModel';
import { AnswerMessage, ClientType, Hubmethod, IceCandidateMessage, MessageTypes, OfferMessage, Payload } from './constants';

class SignalingChannel {
    connection: HubConnection | null = null;
    onSocketMessage: (message: Payload) => void;
    clientType: string;
    // @ts-expect-error
    startPromise: Promise<void>;
    user: UserModel;

    constructor(onMessage: any, clientType: ClientType, user: UserModel) {
        this.onSocketMessage = onMessage;
        this.clientType = clientType;
        this.user = user;

        const token = localStorage.getItem('token');

        try {
            this.connection = new HubConnectionBuilder()
                .withUrl(`${import.meta.env.VITE_SERVER_URL}/chatHub?clientType=${this.clientType}&token=${token}`, {
                    logger: LogLevel.Error,
                    transport: HttpTransportType.WebSockets | HttpTransportType.LongPolling,
                    withCredentials: false,
                })
                .build();

            this.startPromise = this.connection.start();
            this.startPromise.then(() => this.connection?.on('ReceiveMessage', this.onSocketMessage));

        } catch (error) {
            console.error(error);
        }
    }

    sendOffer = async (offer: Omit<OfferMessage, 'type' | 'sender'>) => this.sendMessage(Hubmethod.SEND_OFFER,
        { ...offer, type: MessageTypes.OFFER, sender: ClientType.STREAMER });
    sendAnswer = async (answer: Omit<AnswerMessage, 'type' | 'sender' | 'receiver'>) => this.sendMessage(Hubmethod.SEND_ANSWER,
        { ...answer, type: MessageTypes.ANSWER, receiver: ClientType.STREAMER, sender: this.user.userId, });
    sendIceCandidate = async (iceCandidate: Omit<IceCandidateMessage, 'type' | 'sender'>) => this.sendMessage(Hubmethod.SEND_ICE_CANDIDATE,
        { ...iceCandidate, type: MessageTypes.ICE_CANDIDATE, sender: ClientType.STREAMER });

    private sendMessage = async (hubmethod: Hubmethod, payload: Payload) => {
        if (!this.connection) {
            console.error('Connection is not initialized');
            return;
        }

        try {
            await this.connection.invoke(hubmethod, payload);
        } catch (error) {
            // reconnect()
            // Show Error message?
            console.error(error);
        }
    };

    async cleanUpConnection() {
        this.connection?.off('ReceiveMessage');
        this.startPromise?.then(() => {
            this.connection?.stop();
            this.connection = null;

        });
    }
}

export { SignalingChannel };

