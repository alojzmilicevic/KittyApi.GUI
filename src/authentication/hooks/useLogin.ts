import { SubmitHandler, useForm } from 'react-hook-form';
import { getUserData, login } from '../service/authentication-service';
import { useAppDispatch } from '../../store/hooks';
import { setUserInfo } from '../../store/app';
import { generateErrorMessage } from '../../errors/errorFactory';

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
            .then(async (token: string) => {
                if (token) {
                    localStorage.setItem('token', token);
                    const user = await getUserData();
                    dispatch(setUserInfo(user));
                }
            })
            .catch((e) => {
                const errorCode = e.response.data.errors;
                setError('email', { ...generateErrorMessage(errorCode) });
            });
    };

    return { onSubmit, control, handleSubmit, errors };
}
