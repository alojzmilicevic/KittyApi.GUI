import axios, { AxiosResponse } from 'axios';
import { appAxios } from '../../services/serviceMiddleware';
import { UserModel } from '../../user/UserModel';

const baseUrl = 'https://localhost:7076';
export const appUrl = `${baseUrl || process.env.REACT_APP_SERVER_URL}/api`;
export const resourcesUrl = `${baseUrl || process.env.REACT_APP_SERVER_URL}`;

export const login = async (email: string | null, password: string | null) =>
    axios
        .post<string>(`${appUrl}/auth/login`, {
            userName: email,
            password,
        })
        .then((response: AxiosResponse<string>) => response.data)
        .catch((e) => {
            throw new Error(e);
        });

export const getUserData: () => Promise<UserModel> = () => {
    return appAxios
        .get<UserModel>(`${appUrl}/user`)
        .then((res: AxiosResponse<UserModel>) => res.data)
        .catch((e) => {
            throw new Error(e);
        });
};

export const changeUserName = (username: string) =>
    appAxios
        .post<{ user: UserModel; token: string }>(
            `${appUrl}/user/change-username?username=${username}`
        )
        .then(
            (res: AxiosResponse<{ user: UserModel; token: string }>) => res.data
        )
        .catch((e) => {
            throw new Error(e);
        });

export const checkUsername = (username: string) =>
    appAxios.get(`${appUrl}/user/check-username`, {
        params: { username },
    });
