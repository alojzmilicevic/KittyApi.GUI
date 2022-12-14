import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getUser, setUserInfo } from '../../store/app';
import { SubmitHandler, useForm } from 'react-hook-form';
import AuthService from '../../authentication/service/authentication-service';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { SimpleErrorResponse } from '../../errors/errorFactory';

interface IProfileInput {
    username: string;
}

const validateUsername = async (
    value: string | undefined,
    setLoading: (isLoading: boolean) => void
) => {
    if (!value) return true;

    setLoading(true);

    const res = await AuthService.checkUsername(value);
    setLoading(false);
    return !res.data;
};

export function useProfilePage() {
    const user = useAppSelector(getUser);
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .min(6)
            .max(24)
            .required()
            .test('_', 'This username is taken', (value: string | undefined) =>
                validateUsername(value, setLoading)
            ),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
        reset,
    } = useForm<IProfileInput>({
        resolver: yupResolver(validationSchema),
        mode: 'onChange',
    });

    const onSubmit: SubmitHandler<IProfileInput> = async (data) => {
        try {
            const res = await AuthService.changeUserName(data.username);
            localStorage.setItem('token', res.token);
            dispatch(setUserInfo(res.user));
            reset();
        } catch (e) {
            let error = e as SimpleErrorResponse;
            setError('username', { type: error.type, message: error.message });
        }
    };

    return {
        control,
        user,
        errors,
        onSubmit: handleSubmit(onSubmit),
        loading,
    };
}
