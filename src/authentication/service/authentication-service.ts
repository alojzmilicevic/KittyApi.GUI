import axios, { AxiosError, AxiosResponse } from 'axios';
import { generateErrorMessage } from '../../errors/errorFactory';
import { ServerError } from '../../errors/serverError';
import { appAxios } from '../../services/serviceMiddleware';
import { UserModel } from '../../user/UserModel';
import { getTokenFromLocalStore } from '../../common/util/util';

export const appUrl = `${import.meta.env.VITE_SERVER_URL}/api`;
export const resourcesUrl = `${import.meta.env.VITE_SERVER_URL}`;

export type LoginResponse = {
    token: string;
    user: UserModel;
};

export type AuthenticationResult = {
    accessToken: string;
    refreshToken: string;
    expiry: Date;
};

const login = async (username: string | null, password: string | null): Promise<AuthenticationResult> =>
    axios
        .post<AuthenticationResult>(`${appUrl}/auth/login`, {
            username,
            password,
        })
        .then((response: AxiosResponse<AuthenticationResult>) => response.data)
        .catch((e) => {
            if (e.code === 'ERR_NETWORK') {
                throw new ServerError({ ...generateErrorMessage('Server.Error') });
            }

            throw new ServerError({ ...generateErrorMessage(e.response!.data.errors) });
        });

const refreshToken = async (): Promise<AuthenticationResult> => {
    const oldAuth = getTokenFromLocalStore();

    return axios.post<AuthenticationResult>(`${appUrl}/auth/refresh`, {
        ...oldAuth,
    })
        .then((response: AxiosResponse<AuthenticationResult>) => response.data);
};

const getUserData: () => Promise<UserModel> = () => appAxios
    .get<UserModel>(`${appUrl}/user`)
    .then((res: AxiosResponse<UserModel>) => res.data)
    .catch((e: AxiosError) => {
        throw new Error(e.message);
    });

const changeUserName = (username: string): Promise<LoginResponse> =>
    appAxios
        .post<LoginResponse>(
            `${appUrl}/user/change-username?username=${username}`
        )
        .then(
            (res: AxiosResponse<LoginResponse>) => res.data
        )
        .catch((e) => {
            throw new ServerError({ ...generateErrorMessage(e.response!.data.errors) });
        });

const checkUsername = (username: string) =>
    appAxios.get(`${appUrl}/user/check-username`, {
        params: { username },
    });


export default {
    login,
    refreshToken,
    getUserData,
    changeUserName,
    checkUsername,
};