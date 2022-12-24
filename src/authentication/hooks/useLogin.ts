import { SubmitHandler, useForm } from 'react-hook-form';
import { ServerError } from '../../errors/serverError';
import { setUserInfo } from '../../store/app';
import { useAppDispatch } from '../../store/hooks';
import AuthService from '../service/authentication-service';
import { addTokenToLocalStore } from '../../common/util/util';

interface IFormInput {
    username: string;
    password: string;
}

export function useLogin() {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<IFormInput>();

    const dispatch = useAppDispatch();

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            const authResult = await AuthService.login(data.username, data.password);
            if (authResult.accessToken) {
                addTokenToLocalStore(authResult)
            }
            const user = await AuthService.getUserData();
            
            if (user) {
                dispatch(setUserInfo(user));
            }
        } catch (error) {
            const e = error as ServerError;
            setError('username', { type: e.type, message: e.message });
        }
    };

    return { onSubmit, control, handleSubmit, errors };
}
