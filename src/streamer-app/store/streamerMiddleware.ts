import StreamerConnectionHandler from "../peer-connection/StreamerConnectionHandler";
import { createAction } from "@reduxjs/toolkit";
import { logout } from '../../store/app';

let client: StreamerConnectionHandler | null = null;

export const streamerMiddleware = (store: any) => (next: any) => (action: any) => {
    switch (action.type) {
        case init.type:
            if (!client) {
                client = new StreamerConnectionHandler(store);
            }
            break;

        case cleanup.type:
            client?.cleanUpConnection();
            break;
        case logout.type:
            client?.logout();
            break;
        default:
    }

    return next(action);
};

export const init = createAction('streamer/init');
export const cleanup = createAction('streamer/cleanup');
