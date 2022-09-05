import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export enum CallStatus {
    IDLE,
    CONNECTING,
    CONNECTED
}
export const app = createSlice({
    name: 'app',
    initialState: {
        callStatus: CallStatus.IDLE,
    },
    reducers: {
        setCallStatus: (state, { payload }: PayloadAction<{ callStatus: CallStatus }>) => {
            state.callStatus = payload.callStatus;
        },
    },
})
export const getCallStatus = (state: RootState) => state.app.callStatus;


// Action creators are generated for each case reducer function
export const { setCallStatus } = app.actions
