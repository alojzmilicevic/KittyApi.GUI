import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/material';
import { Controller } from 'react-hook-form';
import { useLogin } from './useLogin';
import { CatIcon } from '../../assets/CatIcon';

const Copyright = (props: any) => (
    <Typography variant='body2' color='text.secondary' align='center' {...props}>
        {`Copyright © budsub ${new Date().getFullYear()}.`}
    </Typography>
);

const Login = () => {
    const { onSubmit, handleSubmit, control, errors } = useLogin();

    return (
        <Container maxWidth={'xs'}>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <CatIcon fill={'black'} size={128} />
                <Typography component='h1' variant='h5'>
                    Sign in
                </Typography>
                <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
                    <Controller
                        name='email'
                        control={control}
                        defaultValue=''
                        render={({ field }) => <TextField
                            margin='normal'
                            required
                            fullWidth
                            id='email'
                            label='Email Address'
                            autoComplete='email'
                            autoFocus
                            {...field} />}
                    />
                    <Controller
                        name='password'
                        control={control}
                        defaultValue=''
                        render={({ field }) => <TextField
                            margin='normal'
                            required
                            fullWidth
                            label='Password'
                            type='password'
                            id='password'
                            autoComplete='current-password'
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            {...field} />}
                    />
                    <FormControlLabel
                        control={<Checkbox value='remember' color='primary' />}
                        label='Remember me'
                    />
                    <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    );
};

export { Login };
