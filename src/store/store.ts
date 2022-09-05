import { configureStore } from "@reduxjs/toolkit";
import { users } from "../streamer-app/user/store/store";
import { streamerMiddleware } from "../streamer-app/store/streamerMiddleware";
import { viewerMiddleware } from "../viewer-app/store/viewerMiddleware";
import { viewer } from "../viewer-app/store/store";
import { app } from "./app";

export const store = configureStore({
    reducer: {
        viewer: viewer.reducer,
        users: users.reducer,
        app: app.reducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(streamerMiddleware, viewerMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
