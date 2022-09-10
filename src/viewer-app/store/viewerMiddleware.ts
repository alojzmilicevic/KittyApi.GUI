import { createAction } from "@reduxjs/toolkit";
import ViewerConnectionHandler from "../peer-connection/ViewerConnectionHandler";

let client: ViewerConnectionHandler | null = null;

const baseAction = 'viewer';

export const viewerMiddleware = (store: any) => (next: any) => (action: any) => {
    switch (action.type) {
        case init.type:
            client = new ViewerConnectionHandler(store);
            break;

        case cleanup.type:
            client?.cleanUpConnection();
            break;

        case leaveStream.type:
            client?.leaveStream();
            break;

        case connectToStream.type:
            client?.connectToStream();
            break;

        default:
    }

    return next(action);
};

export const init = createAction(`${baseAction}/init`);
export const cleanup = createAction(`${baseAction}/cleanup`);
export const connectToStream = createAction(`${baseAction}/leaveStream`);
export const leaveStream = createAction(`${baseAction}/connectToStream`);
