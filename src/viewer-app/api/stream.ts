import axios, { AxiosError } from 'axios';
import { appUrl } from '../../authentication/authentication';
import { ErrorResponse, generateErrorMessage } from '../../errors/errorFactory';

const streamUrl = `${appUrl}/stream`;

const streamAxios = axios.create();

streamAxios.interceptors.request.use(req => {
    const token = localStorage.getItem('token');

    const controller = new AbortController();
    if (!token) {
        controller.abort();
    }
    return { ...req, signal: controller.signal, headers: { ...req.headers, Authorization: `Bearer ${token}` } };
}, (error) => {
    return Promise.reject(error);
});


export const joinStream = async () =>
    streamAxios.post<string>(`${streamUrl}/join-stream`, { streamId: 1 })
        .then(res => res.data)
        .catch((e: AxiosError<ErrorResponse>) => {
            throw new Error(generateErrorMessage(e.response!.data.errors));
        });

export const getStreamInfo = async (streamId: number) =>
    await streamAxios.get(`${streamUrl}/stream-info/${streamId}`).then(res => res.data);

export const leaveStream = () =>
    streamAxios.post(`${streamUrl}/leave-stream`, { streamId: 1 })
        .then(res => res.data);
