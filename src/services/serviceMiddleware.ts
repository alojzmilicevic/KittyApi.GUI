import axios, { AxiosError, AxiosResponse } from "axios";
import { getTokenFromLocalStore, addTokenToLocalStore } from "../common/util/util";
import AuthService, { AuthenticationResult } from "../authentication/service/authentication-service";
export const appAxios = axios.create();


export const setupAxiosInterceptors = (onAuthenticationFailed: () => void) => {
    const onRequestError = (error: AxiosError) => Promise.reject(error);
    const onRequestSuccess = (config: any) => {
        const token: AuthenticationResult = getTokenFromLocalStore();

        if (token) {
            config.headers.Authorization = `Bearer ${token.accessToken}`;
        } else {
            const control = new AbortController();
            control.abort();
            config.signal = control.signal;
        }

        return config;
    };


    const onResponseSuccess = (response: AxiosResponse) => response;
    const onResponseError = async (error: AxiosError) => {
        if (error.response?.status !== 401) {
            return Promise.reject(error);
        }

        const authResult = await AuthService.refreshToken();

        if (authResult) {
            addTokenToLocalStore(authResult);
            return appAxios.request(error.config);
        }
        if (error.response?.status === 401) {
            onAuthenticationFailed();
        }
        return Promise.reject(error);
    };

    appAxios.interceptors.request.use(onRequestSuccess, onRequestError);
    appAxios.interceptors.response.use(onResponseSuccess, onResponseError);
};
