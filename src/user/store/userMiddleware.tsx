import { setUserInfo } from '../../store/app';
import { logout } from '../../store/app';
import { Dispatch, MiddlewareAPI } from 'redux';
import { PayloadAction } from '@reduxjs/toolkit';
import { removeTokenFromLocalStore } from '../../common/util/util';

export const userMiddleware = ({ dispatch }: MiddlewareAPI) => (next: Dispatch) => (action: PayloadAction<{ payload: any, type: string }>) => {
    switch (action.type) {
        case logout.type:
            dispatch(setUserInfo(undefined));
            removeTokenFromLocalStore();
            break;
        default:
    }

    return next(action);
};

