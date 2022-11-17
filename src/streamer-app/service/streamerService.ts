import axios, { AxiosResponse } from 'axios';
import { appUrl } from '../../authentication/service/authentication-service';
import { Thumbnail } from '../../viewer-app/interface';

const streamerApi = axios.create();

streamerApi.interceptors.request.use(
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

export const getThumbnailData: () => Promise<Thumbnail[]> = () =>
    streamerApi
        .get<Thumbnail[]>(`${appUrl}/resources/stream-thumbnails`)
        .then((res: AxiosResponse<Thumbnail[]>) => res.data)
        .catch((e) => {
            throw new Error(e);
        });

export const startStream = (streamTitle: string, thumbnailId: number) =>
    streamerApi
        .post(`${appUrl}/stream/start-stream`, {
            streamTitle,
            thumbnailId,
        })
        .then((res: AxiosResponse) => res.data)
        .catch((e) => {
            throw new Error(e);
        });

export const endStream = (streamId: string) => {
    return streamerApi
        .post(`${appUrl}/stream/end-stream/${streamId}`)
        .then((res: AxiosResponse) => res.data)
        .catch((e) => {
            throw new Error(e);
        });
};
