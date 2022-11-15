import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { grey } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import { Controller } from 'react-hook-form';
import { CatIcon } from '../../assets/CatIcon';
import { StyledTextField } from '../../components/StyledTextField';
import { useLogin } from '../hooks/useLogin';

const FlexBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(6),
}));

const Login = () => {
    const { onSubmit, handleSubmit, control, errors } = useLogin();

    return (
        <FlexBox>
            <CatIcon fill={grey[600]} size={128} />
            <Typography component='h1' variant='h5'>
                Sign in
            </Typography>
            <Box component='form' onSubmit={handleSubmit(onSubmit)} >
                <Controller
                    name='email'
                    control={control}
                    defaultValue=''
                    render={({ field }) => <StyledTextField
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
                    render={({ field }) => <StyledTextField
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
                <Button
                    type='submit'
                    color='secondary'
                    variant='contained'
                    sx={{ mt: 2, width: '100%' }}
                >
                    Sign In
                </Button>
            </Box>
        </FlexBox>
    );
};

export { Login };

