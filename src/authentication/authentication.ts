import axios, { AxiosResponse } from "axios";
import { UserModel } from "../streamer-app/user/UserModel";

const firstUrl = 'https://localhost:7076'
export const appUrl = `${firstUrl || process.env.REACT_APP_SERVER_URL}/api`;

const userDataAxios = axios.create();

userDataAxios.interceptors.request.use(req => {
    const token = localStorage.getItem('token');

    const controller = new AbortController();
    if (!token) {
        controller.abort();
    }
    return  {...req, signal: controller.signal };
}, (error) => {
    return Promise.reject(error);
})

export const login = async (email: string | null, password: string | null) => {
    const response = await axios.post<string>(`${appUrl}/auth/login`, { userName: email, password });

    return response.data;
}

export const getUserData: () => (Promise<UserModel>) = () => {
    const token = localStorage.getItem('token');

    return userDataAxios.get<UserModel>(`${appUrl}/user`, {
        headers: {
            Authorization: "Bearer " + token,
        },
    })
        .then((res: AxiosResponse<UserModel>) => (res.data))
        .catch(e => {
            throw new Error(e);
        });
}
