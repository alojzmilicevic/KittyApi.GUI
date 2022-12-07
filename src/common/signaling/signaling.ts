import {
    HttpTransportType,
    HubConnection,
    HubConnectionBuilder, LogLevel
} from '@microsoft/signalr';
import { ClientType, SignalRMessageTypes } from './constants';

class SignalingChannel {
    connection: HubConnection | null = null;
    onSocketMessage: (user: any, message: any) => void;
    clientType: string;
    shouldStopConnection: boolean = false;

    constructor(onMessage: any, clientType: ClientType) {
        this.onSocketMessage = onMessage;
        this.clientType = clientType;
    }

    async init() {
        if (this.connection) return;

        const token = localStorage.getItem('token');
        try {
            this.connection = new HubConnectionBuilder()
                .withUrl(`${import.meta.env.VITE_SERVER_URL}/chatHub?clientType=${this.clientType}&token=${token}`, {
                    logger: LogLevel.Error,
                    transport: HttpTransportType.WebSockets | HttpTransportType.LongPolling,
                    withCredentials: false,
                })
                .build();

            await this.connection.start();

            this.connection?.on('ReceiveMessage',
                (user, message) => this.onSocketMessage(user, message));

        } catch (error) {
            console.error(error);
        }

    }

    sendMessageToViewer = async (message: any, user: string) => {
        if (this.connection) {
            await this.connection.invoke(SignalRMessageTypes.SEND_MESSAGE_TO_VIEWER_BASED_ON_USER_NAME, 'streamer', user, message);
        } else {
            // reconnect()
            // Show Error message?
        }
    };

    sendMessageToStreamer = async (message: { type: string, payload: any }, sender: string) => {
        if (this.connection) {
            await this.connection.invoke(SignalRMessageTypes.SEND_MESSAGE_TO_STREAMER, sender, message);
        } else {
            // reconnect()
            // Show Error message?
        }
    };

    async cleanUpConnection() {
        if (!this.connection) {
            return;
        }

        this.connection.off('ReceiveMessage');
        await this.connection.stop();
        this.connection = null;
    }
}

export { SignalingChannel };

