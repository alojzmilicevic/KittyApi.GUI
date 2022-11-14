import { createAction, PayloadAction } from '@reduxjs/toolkit';
import ViewerConnectionHandler from '../peer-connection/ViewerConnectionHandler';
import { logout } from '../../store/app';

let client: ViewerConnectionHandler | null = null;

const baseAction = 'viewer';

export const viewerMiddleware =
    (store: any) => (next: any) => async (action: PayloadAction) => {
        switch (action.type) {
            case init.type:
                const { streamId } = action.payload!;

                client = new ViewerConnectionHandler(store, streamId);
                break;

            case cleanup.type:
                client?.cleanUpConnection();
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

export const init = createAction<{ streamId: string }>(`${baseAction}/init`);
export const cleanup = createAction(`${baseAction}/cleanup`);
export const connectToStream = createAction(`${baseAction}/leaveStream`);
export const leaveStream = createAction(`${baseAction}/connectToStream`);
