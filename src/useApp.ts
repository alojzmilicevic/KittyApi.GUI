import { useCallback, useEffect, useState } from "react";
import { UserModel } from "./streamer-app/user/UserModel";
import { getUserData } from "./authentication/authentication";

export function useApp() {
    const [user, setUser] = useState<UserModel | null>(null);
    const [ready, setReady] = useState(false);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('token');
    }, [])

    const fetchUser = useCallback(() => {
        getUserData()
            .then((userData) => {
                if (userData) {
                    setUser(userData);
                }
            }).catch(error => {
            logout();
        }).finally(() => {
            setReady(true);
        })
    }, [logout])

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return { user, ready, setUser, logout };
}
