import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ClientType, SignalRMessageTypes } from "./constants";

class SignalingChannel {
    connection: HubConnection | null = null;
    shouldStopHubConnection: boolean = false;

    constructor(onMessage: any, clientType: ClientType) {
        // Even though im awaiting functions inside off the initConnection function the constructor will still be completed.
        // This means that people using functions can do so even if we aren't connected.
        // Use Readiness Design Patter to fix this
        this.init(onMessage, clientType);
    }

    async init(onMessage: any, clientType: string) {
        this.connection = new HubConnectionBuilder()
            .withUrl(`${process.env.REACT_APP_SERVER_URL}/chatHub?clientType=${clientType}`, {
                logger: LogLevel.Error,
                transport: HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .build();

        await this.connection?.start();

        /*
        * We have to wait for start to finish before calling stop.
        * When Start has finished, and we should stop the connection we do that.
        * */
        if (this.shouldStopHubConnection) {
            this.shouldStopHubConnection = false;
            await this.connection?.stop();
            this.connection = null;
        }

        this.connection?.on('ReceiveMessage',
            (user, message) => onMessage(user, message));
    }

    sendMessageToViewer = async (message: any, user: string) => {
        if (this.connection) {
            await this.connection.invoke(SignalRMessageTypes.SEND_MESSAGE_TO_VIEWER, 'streamer', user, message);
        } else {
            // reconnect()
            // Show Error message?
        }
    };

    sendMessageToStreamer = async (message: { type: string, payload: any }) => {
        if (this.connection) {
            await this.connection.invoke(SignalRMessageTypes.SEND_MESSAGE_TO_STREAMER, this.connection.connectionId, message);
        } else {
            // reconnect()
            // Show Error message?
        }
    }

    async cleanUpConnection() {
        if (!this.connection) return;

        this.connection.off('ReceiveMessage');

        if (this.shouldStopHubConnection) {
            await this.connection.stop();
            this.connection = null;
        }
        this.shouldStopHubConnection = true;
    }

    getConnectionId(): string | null | undefined {
        return this.connection?.connectionId;
    }
}

export { SignalingChannel };
