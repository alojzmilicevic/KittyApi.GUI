import { configureStore } from '@reduxjs/toolkit';
import { viewerMiddleware } from '../viewer-app/store/viewerMiddleware';
import { app } from './app';
import { streamerMiddleware } from '../streamer-app/store/streamerMiddleware';
import { userMiddleware } from '../user/store/userMiddleware';

export const store = configureStore({
    reducer: { app: app.reducer },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            viewerMiddleware,
            streamerMiddleware,
            userMiddleware
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
