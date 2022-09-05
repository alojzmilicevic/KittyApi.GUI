import { SubmitHandler, useForm } from "react-hook-form";
import { getUserData, login } from "../authentication";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import { UserModel } from "../../streamer-app/user/UserModel";

interface IFormInput {
    email: string;
    password: string;
}

export interface ILoginProps {
    setUser: React.Dispatch<React.SetStateAction<UserModel | null>>,
}

export function useLogin({ setUser }: ILoginProps) {
    const nav = useNavigate();
    const { control, handleSubmit, formState: { errors }, setError } = useForm<IFormInput>();


    const onSubmit: SubmitHandler<IFormInput> = data => {
        login(data.email, data.password).then(async (token: string) => {
            if (token) {
                localStorage.setItem('token', token);
                const user = await getUserData();
                setUser(user);
                nav('/client');
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
