import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { UserModel } from '../user/UserModel';
import { SimpleErrorResponse } from '../errors/errorFactory';

export type StreamInfo = {
    streamId: string;
    streamTitle: string;
    isActive: boolean;
    users: UserModel[];
};

export enum ConnectionStatus {
    IDLE,
    CONNECTING,
    CONNECTED,
}

export enum AppStatus {
    IDLE = 'IDLE',
    INITIALIZING = 'INITIALIZING',
    INITIALIZED = 'INITIALIZED',
    FETCHING_STREAM_INFO = 'FETCHING_STREAM_INFO',
    FETCHED_STREAM_INFO = 'FETCHED_STREAM_INFO',
    FETCHING_STREAMS = 'FETCHING_STREAMS',
    FETCHED_STREAMS = 'FETCHED_STREAMS',
}

type AppError = {
    error: SimpleErrorResponse;
    action: string;
    label: string;
};

type State = {
    connectionStatus: ConnectionStatus;
    user?: UserModel;
    streamInfo?: StreamInfo;
    appError?: AppError;
    appStatus: AppStatus;
};

const initialState: State = {
    connectionStatus: ConnectionStatus.IDLE,
    appStatus: AppStatus.IDLE,
    user: undefined,
    streamInfo: undefined,
};

export const app = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setConnectionStatus: (
            state,
            { payload }: PayloadAction<{ connectionStatus: ConnectionStatus }>
        ) => {
            state.connectionStatus = payload.connectionStatus;
        },
        setUserInfo: (
            state: State,
            { payload }: PayloadAction<UserModel | undefined>
        ) => {
            state.user = payload;
        },
        setAppStatus: (
            state: State,
            { payload }: PayloadAction<AppStatus>
        ) => {
            state.appStatus = payload;
        },
        setStreamInfo: (
            state,
            action: PayloadAction<StreamInfo | undefined>
        ) => {
            if (action.payload) {
                state.streamInfo = action.payload;
            } else {
                state.streamInfo = undefined;
            }
        },
        setError: (state, action: PayloadAction<AppError | undefined>) => {
            state.appError = action.payload;
        },
    },
});

/*---------------- SELECTORS------------- */
export const getUser = (state: RootState) => state.app.user;
export const getStreamInfo = (state: RootState) => state.app.streamInfo;
export const getConnectionStatus = (state: RootState) =>
    state.app.connectionStatus;

export const getError = (state: RootState) => state.app.appError;
export const getAppStatus = (state: RootState) => state.app.appStatus;

// Action creators are generated for each case reducer function
export const { setConnectionStatus, setUserInfo, setStreamInfo, setError, setAppStatus } =
    app.actions;
export const logout = createAction('app/logout');
