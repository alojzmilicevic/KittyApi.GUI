import { SubmitHandler, useForm } from 'react-hook-form';
import { ServerError } from '../../errors/serverError';
import { setUserInfo } from '../../store/app';
import { useAppDispatch } from '../../store/hooks';
import { login, LoginResponse } from '../service/authentication-service';

interface IFormInput {
    email: string;
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

    const onSubmit: SubmitHandler<IFormInput> = (data) => {
        login(data.email, data.password)
            .then(({ token, user }: LoginResponse) => {
                if (token) {
                    localStorage.setItem('token', token);
                    dispatch(setUserInfo(user));
                }
            })
            .catch((e: ServerError) => setError('email', { type: e.type, message: e.message }));
    };

    return { onSubmit, control, handleSubmit, errors };
}
