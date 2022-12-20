import { configureStore } from '@reduxjs/toolkit';
import { viewerMiddleware } from '../viewer-app/store/viewerMiddleware';
import { app, logoutUser } from './app';
import { streamerMiddleware } from '../streamer-app/store/streamerMiddleware';
import { userMiddleware } from '../user/store/userMiddleware';
import { setupAxiosInterceptors } from '../services/serviceMiddleware';

export const store = configureStore({
    reducer: { app: app.reducer },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            viewerMiddleware,
            streamerMiddleware,
            userMiddleware
        ),
});

const { dispatch } = store;
setupAxiosInterceptors(() => dispatch(logoutUser()));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
