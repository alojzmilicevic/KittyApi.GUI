import { Container, styled } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { grey } from '@mui/material/colors';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Controller } from 'react-hook-form';
import { CatIcon } from '../../assets/CatIcon';
import { useLogin } from './useLogin';

const Copyright = (props: any) => (
    <Typography variant='body2' align='center' {...props}>
        {`Copyright © budsub ${new Date().getFullYear()}.`}
    </Typography>
);


export const CssTextField = styled(TextField)(({ theme }) => ({
    '& label.Mui-focused': {
        color: theme.palette.primary.contrastText
    },
}));

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
                <CatIcon fill={grey[600]} size={128} />
                <Typography component='h1' variant='h5'>
                    Sign in
                </Typography>
                <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
                    <Controller
                        name='email'
                        control={control}
                        defaultValue=''
                        render={({ field }) => <CssTextField
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
                        render={({ field }) => <CssTextField
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
                        control={<Checkbox value='remember' />}
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

