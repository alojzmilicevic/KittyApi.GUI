import axios, { AxiosError, AxiosResponse } from 'axios';
import { generateErrorMessage } from '../../errors/errorFactory';
import { ServerError } from '../../errors/serverError';
import { appAxios } from '../../services/serviceMiddleware';
import { UserModel } from '../../user/UserModel';

export const appUrl = `${import.meta.env.VITE_SERVER_URL}/api`;
export const resourcesUrl = `${import.meta.env.VITE_SERVER_URL}`;

export type LoginResponse = {
    token: string;
    user: UserModel;
};

export const login = async (email: string | null, password: string | null): Promise<LoginResponse> =>
    axios
        .post<LoginResponse>(`${appUrl}/auth/login`, {
            userName: email,
            password,
        })
        .then((response: AxiosResponse<LoginResponse>) => response.data)
        .catch((e) => {
            if (e.code === 'ERR_NETWORK') {
                throw new ServerError({ ...generateErrorMessage('Server.Error') });
            }

            throw new ServerError({ ...generateErrorMessage(e.response!.data.errors) });
        });

export const getUserData: () => Promise<UserModel> = () => appAxios
    .get<UserModel>(`${appUrl}/user`)
    .then((res: AxiosResponse<UserModel>) => res.data)
    .catch((e: AxiosError) => {
        throw new Error(e.message);
    });

export const changeUserName = (username: string): Promise<LoginResponse> =>
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

export const checkUsername = (username: string) =>
    appAxios.get(`${appUrl}/user/check-username`, {
        params: { username },
    });
