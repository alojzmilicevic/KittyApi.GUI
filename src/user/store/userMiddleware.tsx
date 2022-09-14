import { setUserInfo } from '../../store/app';
import { logout } from '../../store/app';
import { Dispatch, MiddlewareAPI } from 'redux';
import { PayloadAction } from '@reduxjs/toolkit';

export const userMiddleware = ({ dispatch }: MiddlewareAPI) => (next: Dispatch) => (action: PayloadAction<{ payload: any, type: string }>) => {
    switch (action.type) {
        case logout.type:
            dispatch(setUserInfo(undefined));
            localStorage.removeItem('token');
            break;
        default:
    }

    return next(action);
};

