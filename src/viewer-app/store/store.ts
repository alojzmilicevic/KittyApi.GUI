import { createSlice } from "@reduxjs/toolkit";

export const viewer = createSlice({
    name: 'viewer',
    initialState: {},
    reducers: {
        cleanup: (state) => {
        },
        connectToStream: (state) => {
        },
        leaveStream: (state) => {
        },
    },
})

// Action creators are generated for each case reducer function
export const { cleanup, connectToStream, leaveStream } = viewer.actions
