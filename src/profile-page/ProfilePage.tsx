import { default as Grid } from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Card, CardActions, CardContent, CircularProgress, Divider } from '@mui/material';
import { grey } from '@mui/material/colors';
import Button from '@mui/material/Button';
import { StyledTextField } from '../components/StyledTextField';
import { Controller } from 'react-hook-form';
import * as React from 'react';
import { useProfilePage } from './useProfilePage';


export const ProfilePage = () => {
    const { onSubmit, control, user, errors, isDirty, isValid, loading } = useProfilePage();

    return <Grid container spacing={2} sx={{ pt: 6, pl: 4, pr: 4, pb: 6 }}>
        <Grid xs={12}>
            <Typography variant={'h3'}>Inställningar</Typography>
        </Grid>
        <Divider sx={{ width: '100%' }} />

        <Grid xs={12}>
            <Typography variant={'h5'}>Profilinställningar</Typography>
            <Typography variant={'subtitle1'} sx={{ color: grey[500] }} gutterBottom>
                Ändra identifieringsuppgifterna för ditt konto
            </Typography>
            <Card onSubmit={onSubmit} component={'form'}>
                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant={'body1'} sx={{ fontWeight: 'bold', mr: 2 }}>
                        Användarnamn
                    </Typography>
                    <Controller
                        name={'username'}
                        control={control}
                        defaultValue={''}
                        render={({ field }) =>
                            <StyledTextField
                                placeholder={user?.username}
                                fullWidth
                                size='small' {...field}
                                error={!!errors.username}
                                helperText={errors.username?.message}
                                InputProps={{
                                    endAdornment: loading && <CircularProgress color={'secondary'} size={24} />
                                }}
                            />
                        }
                    />
                </CardContent>
                <CardActions sx={{
                    backgroundColor: 'primary.main',
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}>
                    <Button
                        disabled={!isDirty || !isValid}
                        type={'submit'}
                        size='small'
                        variant={'contained'}
                        color='secondary'
                        sx={{ mr: 1 }}
                    >
                        Spara ändringar
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    </Grid>;
};
