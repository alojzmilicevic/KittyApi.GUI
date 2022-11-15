import axios from "axios";

export const appAxios = axios.create();

appAxios.interceptors.request.use(
    (req) => {
        const token = localStorage.getItem('token');

        const controller = new AbortController();
        if (!token) {
            controller.abort();
        }
        return {
            ...req,
            signal: controller.signal,
            headers: { ...req.headers, Authorization: `Bearer ${token}` },
        };
    },
    (error) => {
        return Promise.reject(error);
    }
);
