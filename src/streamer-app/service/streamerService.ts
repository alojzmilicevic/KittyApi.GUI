import { AxiosResponse } from 'axios';
import { appUrl } from '../../authentication/service/authentication-service';
import { appAxios } from '../../services/serviceMiddleware';
import { Thumbnail } from '../../viewer-app/interface';

const getThumbnailData: () => Promise<Thumbnail[]> = () =>
    appAxios
        .get<Thumbnail[]>(`${appUrl}/resources/stream-thumbnails`)
        .then((res: AxiosResponse<Thumbnail[]>) => res.data)
        .catch((e) => {
            throw new Error(e);
        });

const startStream = (streamTitle: string, thumbnailId: number) =>
    appAxios
        .post(`${appUrl}/stream/start-stream`, {
            streamTitle,
            thumbnailId,
        })
        .then((res: AxiosResponse) => res.data)
        .catch((e) => {
            throw new Error(e);
        });

const endStream = (streamId: string) => {
    return appAxios
        .post(`${appUrl}/stream/end-stream/${streamId}`)
        .then((res: AxiosResponse) => res.data)
        .catch((e) => {
            throw new Error(e);
        });
};

export default {
    getThumbnailData,
    startStream,
    endStream,
};