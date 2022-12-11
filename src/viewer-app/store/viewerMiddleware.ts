import { createAction, PayloadAction } from '@reduxjs/toolkit';
import { logout } from '../../store/app';
import ViewerConnectionHandler from '../peer-connection/viewerMiddleware';

let client: ViewerConnectionHandler | null = null;

const baseAction = 'viewer';
type InitAction = { streamId: string };
type ViewerAction = PayloadAction<InitAction> | PayloadAction<undefined>;

export const viewerMiddleware =
    (store: any) => (next: any) => async (action: ViewerAction) => {
        switch (action.type) {
            case init.type:
                client = new ViewerConnectionHandler(store);
                break;

            case cleanup.type:
                client?.cleanUp();
                client = null;
                break;

            case fetchStreamInfo.type:
                const { streamId } = action.payload as InitAction;
                client?.getStreamInfo(streamId);
                break;
            case leaveStream.type:
                client?.leaveStream();
                break;

            case connectToStream.type:
                client?.connectToStream();
                break;

            case logout.type:
                await client?.logout();
                break;
            default:
        }

        return next(action);
    };

export const init = createAction(`${baseAction}/init`);
export const fetchStreamInfo = createAction<InitAction>(`${baseAction}/fetchStreamInfo`);
export const cleanup = createAction(`${baseAction}/cleanup`);
export const connectToStream = createAction(`${baseAction}/leaveStream`);
export const leaveStream = createAction(`${baseAction}/connectToStream`);
