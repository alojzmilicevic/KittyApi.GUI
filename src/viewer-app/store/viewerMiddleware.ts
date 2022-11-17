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
                const { streamId } = action.payload as InitAction;
                client = new ViewerConnectionHandler(store, streamId);
                break;

            case cleanup.type:
                client?.leaveStream();
                client = null;
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

export const init = createAction<InitAction>(`${baseAction}/init`);
export const cleanup = createAction(`${baseAction}/cleanup`);
export const connectToStream = createAction(`${baseAction}/leaveStream`);
export const leaveStream = createAction(`${baseAction}/connectToStream`);
