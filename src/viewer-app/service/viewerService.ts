import { AxiosError } from 'axios';
import { ErrorResponse, generateErrorMessage } from '../../errors/errorFactory';
import { ServerError } from '../../errors/serverError';
import { appAxios } from '../../services/serviceMiddleware';
import { streamUrl } from '../../services/streamService';

export const joinStream = async (streamId: string) =>
    appAxios
        .post<string>(`${streamUrl}/join-stream/${streamId}`)
        .then((res) => res.data)
        .catch((e: AxiosError<ErrorResponse>) => {
            throw new ServerError({
                ...generateErrorMessage(e.response!.data.errors),
            });
        });

export const getStreams = async () =>
    await appAxios.get(`${streamUrl}/stream-info`).then((res) => res.data);

export const leaveStream = (streamId: string) =>
    appAxios
        .post(`${streamUrl}/leave-stream/${streamId}`)
        .then((res) => res.data);
