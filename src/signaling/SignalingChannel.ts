import {
    HttpTransportType,
    HubConnection,
    HubConnectionBuilder,
    HubConnectionState,
    LogLevel
} from '@microsoft/signalr';
import { ClientType, SignalRMessageTypes } from './constants';

class SignalingChannel {
    connection: HubConnection | null = null;
    onSocketMessage: (user: any, message: any) => void;
    clientType: string;
    shouldStopConnection: boolean = false;

    constructor(onMessage: any, clientType: ClientType, shouldStartConnection: boolean = true) {
        this.onSocketMessage = onMessage;
        this.clientType = clientType;

        if (shouldStartConnection) {
            // Even though im awaiting functions inside off the initConnection function the constructor will still be completed.
            // This means that people using functions can do so even if we aren't connected.
            // Use Readiness Design Patter to fix this
            this.init();
        }
    }

    async init() {
        const token = localStorage.getItem('token');
        this.connection = new HubConnectionBuilder()
            .withUrl(`${process.env.REACT_APP_SERVER_URL}/chatHub?clientType=${this.clientType}&token=${token}`, {
                logger: LogLevel.Error,
                transport: HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .build();

        this.connection.start().then(() => {
            this.connection?.on('ReceiveMessage',
                (user, message) => this.onSocketMessage(user, message));

            if (this.shouldStopConnection) {
                this.cleanUpConnection();
                this.shouldStopConnection = false;
            }
        });
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
        if (!this.connection) return;

        if (this.connection.state === HubConnectionState.Connecting) {
            this.shouldStopConnection = true;
            return;
        }
        this.connection.off('ReceiveMessage');
        await this.connection.stop();
        this.connection = null;
    }
}

export { SignalingChannel };
