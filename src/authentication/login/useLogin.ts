import { SubmitHandler, useForm } from 'react-hook-form';
import { getUserData, login } from '../authentication';
import { useAppDispatch } from '../../store/hooks';
import { setUserInfo } from '../../store/app';

interface IFormInput {
    email: string;
    password: string;
}

export function useLogin() {
    const { control, handleSubmit, formState: { errors }, setError } = useForm<IFormInput>();
    const dispatch = useAppDispatch();

    const onSubmit: SubmitHandler<IFormInput> = data => {
        login(data.email, data.password).then(async (token: string) => {
            if (token) {
                localStorage.setItem('token', token);
                const user = await getUserData();
                dispatch(setUserInfo(user));
            }

            // fetch user information
        }).catch(e => {
            setError('email', {
                type: 'custom',
                message: "Incorrect credentials, please try again."
            });
        });
    };

    return { onSubmit, control, handleSubmit, errors };
}
