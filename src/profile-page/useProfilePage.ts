import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getUser, setUserInfo } from '../store/app';
import { SubmitHandler, useForm } from 'react-hook-form';
import { changeUserName, checkUsername } from '../authentication/authentication';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';

interface IProfileInput {
    username: string,
}

const validateUsername = async (value: string | undefined, setLoading: (isLoading: boolean) => void) => {
    if (!value) return true;

    setLoading(true);

    const res = await checkUsername(value!);
    setLoading(false);
    return !res.data;
}

export function useProfilePage() {
    const user = useAppSelector(getUser);
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();

    const validationSchema = Yup.object().shape({
        username: Yup.string().min(6).max(24).required().test('_', 'This username is taken',
            (value: string | undefined) => validateUsername(value, setLoading))
    });

    const { control, handleSubmit, formState: { errors, isDirty, isValid }, setError, reset } = useForm<IProfileInput>({
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    });

    const onSubmit: SubmitHandler<IProfileInput> = async data => {
        try {
            const res = await changeUserName(data.username);
            localStorage.setItem('token', res.token);
            dispatch(setUserInfo(res.user));
            reset();
        } catch (e) {
            setError('username', {
                type: 'custom',
                message: 'Something went wrong when setting username...'
            });
        }

    };

    return {
        control,
        user,
        errors,
        isDirty,
        isValid,
        onSubmit: handleSubmit(onSubmit),
        loading
    };
}
