import axios, { AxiosResponse } from "axios";
import { UserModel } from "../user/UserModel";

const url = 'https://localhost:7075/api'

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
    const response = await axios.post<string>(`${url}/auth/login`, { userName: email, password });

    return response.data;
}

export const getUserData: () => (Promise<UserModel>) = () => {
    const token = localStorage.getItem('token');

    return userDataAxios.get<UserModel>(`${url}/user`, {
        headers: {
            Authorization: "Bearer " + token,
        },
    })
        .then((res: AxiosResponse<UserModel>) => (res.data))
        .catch(e => {
            throw new Error(e);
        });
}
