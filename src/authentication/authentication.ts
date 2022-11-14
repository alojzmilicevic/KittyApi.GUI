import axios, { AxiosResponse } from 'axios';
import { UserModel } from '../user/UserModel';

const firstUrl = 'https://localhost:7076';
export const appUrl = `${firstUrl || process.env.REACT_APP_SERVER_URL}/api`;
export const resourcesUrl = `${firstUrl || process.env.REACT_APP_SERVER_URL}`;

const userDataAxios = axios.create();

userDataAxios.interceptors.request.use(
    (req) => {
        const token = localStorage.getItem('token');

        const controller = new AbortController();
        if (!token) {
            controller.abort();
        }
        return {
            ...req,
            signal: controller.signal,
            headers: { authorization: `Bearer ${token}` },
        };
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const login = async (email: string | null, password: string | null) => {
    const response = await axios.post<string>(`${appUrl}/auth/login`, {
        userName: email,
        password,
    });

    return response.data;
};

export const getUserData: () => Promise<UserModel> = () => {
    const token = localStorage.getItem('token');

    return userDataAxios
        .get<UserModel>(`${appUrl}/user`, {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
        .then((res: AxiosResponse<UserModel>) => res.data)
        .catch((e) => {
            throw new Error(e);
        });
};

export const changeUserName = (username: string) =>
    userDataAxios
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
    userDataAxios.get(`${appUrl}/user/check-username`, {
        params: { username },
    });
