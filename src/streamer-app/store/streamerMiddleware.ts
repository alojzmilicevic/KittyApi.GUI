import StreamerConnectionHandler from '../peer-connection/StreamerConnectionHandler';
import { createAction } from '@reduxjs/toolkit';
import { logout } from '../../store/app';
import { StartStreamInput } from '../App';

let client: StreamerConnectionHandler | null = null;

export const streamerMiddleware =
    (store: any) => (next: any) => (action: any) => {
        switch (action.type) {
            case init.type:
                client = new StreamerConnectionHandler(store);
                break;
            case cleanup.type:
                client?.cleanUpConnection();
                client = null;
                break;
            case logout.type:
                client?.logout();
                break;
            case startStream.type:
                client?.startStream(action.payload as StartStreamInput);
                break;
            case endStream.type:
                client?.endStream();
                break;
        }

        return next(action);
    };

export const init = createAction('streamer/init');
export const cleanup = createAction('streamer/cleanup');
export const startStream = createAction<StartStreamInput>(
    'streamer/startStream'
);
export const endStream = createAction('streamer/endStream');
