import { useCallback, useEffect, useState } from "react";
import { UserModel } from "./user/UserModel";
import { getUserData } from "./authentication/authentication";

export function useApp() {
    const [user, setUser] = useState<UserModel | null>(null);
    const [loading, setLoading] = useState(true);

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
            setLoading(false);
        })
    }, [logout])

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return { user, loading, setUser, logout };
}
