import { AxiosError } from 'axios';
import { appUrl } from '../authentication/authentication';
import { ErrorResponse, generateErrorMessage } from '../errors/errorFactory';
import { ServerError } from '../errors/serverError';
import { appAxios } from './serviceMiddleware';

export const streamUrl = `${appUrl}/stream`;

export const getStreamInfo = async (streamId: string) =>
    await appAxios
        .get(`${streamUrl}/stream-info/${streamId}`)
        .then((res) => res.data)
        .catch((e: AxiosError<ErrorResponse>) => {
            throw new ServerError({
                ...generateErrorMessage(e.response!.data.errors),
            });
        });
