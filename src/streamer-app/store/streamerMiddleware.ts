import StreamerConnectionHandler from "../peer-connection/StreamerConnectionHandler";
import { createAction } from "@reduxjs/toolkit";

let client: StreamerConnectionHandler | null = null;

export const streamerMiddleware = (store: any) => (next: any) => (action: any) => {
    switch (action.type) {
        case init.type:
            client = new StreamerConnectionHandler(store);
            break;

        case cleanup.type:
            client?.cleanUpConnection();
            break;

        default:
    }

    return next(action);
};

export const init = createAction('streamer/init');
export const cleanup = createAction('streamer/cleanup');
