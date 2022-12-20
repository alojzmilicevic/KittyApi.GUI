import axios, { AxiosError, AxiosResponse } from "axios";

export const appAxios = axios.create();

export const setupAxiosInterceptors = (onAuthenticationFailed: () => void) => {
    const onRequestError = (error: AxiosError) => Promise.reject(error);
    const onRequestSuccess = (config: any) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            const control = new AbortController();
            control.abort();
            config.signal = control.signal;
        }
        
        return config;
    };


    const onResponseSuccess = (response: AxiosResponse) => response;
    const onResponseError = (error: AxiosError) => {
        if (error.response?.status === 401) {
            onAuthenticationFailed();
        }
        return Promise.reject(error);
    };

    appAxios.interceptors.request.use(onRequestSuccess, onRequestError);
    appAxios.interceptors.response.use(onResponseSuccess, onResponseError);
};
