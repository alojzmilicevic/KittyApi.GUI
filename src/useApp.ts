import { useCallback, useEffect, useState } from "react";
import { UserModel } from "./user/UserModel";
import AuthService from "./authentication/service/authentication-service";
import { useAppDispatch, useAppSelector } from './store/hooks';
import { getUser, logout as logoutAction, setUserInfo, getError } from './store/app';

export function useApp() {
    const [ready, setReady] = useState(false);
    const dispatch = useAppDispatch();
    const user = useAppSelector(getUser);
    const error = useAppSelector(getError);

    const logout = useCallback(() => {
        dispatch(logoutAction())
    }, [dispatch])

    const fetchUser = useCallback(() => {
        AuthService.getUserData()
            .then((userData: UserModel) => {
                if (userData) {
                    dispatch(setUserInfo(userData));
                }
            }).catch(() => {
                //            logout();
            }).finally(() => {
                setReady(true);
            })
    }, [dispatch, logout])

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return { user, ready, logout, error };
}
