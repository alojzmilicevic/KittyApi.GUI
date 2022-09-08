import { useCallback, useEffect, useState } from "react";
import { UserModel } from "./streamer-app/user/UserModel";
import { getUserData } from "./authentication/authentication";
import { useAppDispatch, useAppSelector } from './store/hooks';
import { getUser, setUserInfo } from './store/app';

export function useApp() {
    const [ready, setReady] = useState(false);
    const dispatch = useAppDispatch();
    const user = useAppSelector(getUser);

    const logout = useCallback(() => {
        dispatch(setUserInfo(undefined));
        localStorage.removeItem('token');
    }, [dispatch])

    const fetchUser = useCallback(() => {
        getUserData()
            .then((userData: UserModel) => {
                if (userData) {
                    dispatch(setUserInfo(userData));
                }
            }).catch(error => {
            logout();
        }).finally(() => {
            setReady(true);
        })
    }, [dispatch, logout])

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return { user, ready, logout };
}
