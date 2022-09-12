import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { UserModel } from '../streamer-app/user/UserModel';

export type StreamInfo = {
    streamId: number,
    streamTitle: string,
    isActive: boolean,
    users: UserModel[],
}

export enum ConnectionStatus {
    IDLE,
    CONNECTING,
    CONNECTED
}

type State = {
    connectionStatus: ConnectionStatus,
    user?: UserModel,
    streamInfo?: StreamInfo,
};

const initialState: State = {
    connectionStatus: ConnectionStatus.IDLE,
    user: undefined,
    streamInfo: undefined
};

export const app = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setConnectionStatus: (state, { payload }: PayloadAction<{ connectionStatus: ConnectionStatus }>) => {
            state.connectionStatus = payload.connectionStatus;
        },
        setUserInfo: (state: State, { payload }: PayloadAction<UserModel | undefined>) => {
            state.user = payload;
        },
        setStreamInfo: (state, action: PayloadAction<StreamInfo>) => {
            state.streamInfo = { ...action.payload };
        }
    }
});

/*---------------- SELECTORS------------- */
export const getUser = (state: RootState) => state.app.user;
export const getStreamInfo = (state: RootState) => state.app.streamInfo;
export const getConnectionStatus = (state: RootState) => state.app.connectionStatus;


// Action creators are generated for each case reducer function
export const { setConnectionStatus, setUserInfo, setStreamInfo } = app.actions;
export const logout = createAction('app/logout');
