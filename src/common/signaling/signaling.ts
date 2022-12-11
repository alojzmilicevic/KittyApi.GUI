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
    // @ts-expect-error
    startPromise: Promise<void>;

    constructor(onMessage: any, clientType: ClientType) {
        this.onSocketMessage = onMessage;
        this.clientType = clientType;
    }

    async init() {
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
            this.startPromise.then(() => {
                this.connection?.on('ReceiveMessage',
                    (user, message) => this.onSocketMessage(user, message));
            });

        } catch (error) {
            //console.error(error);
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
        this.connection?.off('ReceiveMessage');
        this.startPromise?.then(() => {
            this.connection?.stop();
            this.connection = null;

        });
    }
}

export { SignalingChannel };

