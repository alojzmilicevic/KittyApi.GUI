import { Card, CardActions, CardContent, CircularProgress, styled } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { default as Grid } from '@mui/material/Unstable_Grid2';
import { Controller } from 'react-hook-form';
import { StyledTextField } from '../../components/StyledTextField';
import { useProfilePage } from '../hooks/useProfilePage';

const StyledFlexGrid = styled(Grid)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '4rem',
    flexDirection: 'column',
});

const StyledCardActions = styled(CardActions)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    justifyContent: 'flex-end'
}));

const StyledSubHeader = styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.light,
    marginBottom: theme.spacing(1),
}));

export const ProfilePage = () => {
    const { onSubmit, control, user, errors, loading } = useProfilePage();

    return <StyledFlexGrid container spacing={2}>
        <Grid xs={11} md={5}>
            <Typography variant={'h5'}>Profilinställningar</Typography>
            <StyledSubHeader variant={'subtitle1'}>
                Ändra identifieringsuppgifterna för ditt konto
            </StyledSubHeader>
            <Card onSubmit={onSubmit} component={'form'}>
                <CardContent>
                    <Typography> Användarnamn </Typography>
                    <Controller
                        name={'username'}
                        control={control}
                        defaultValue={''}
                        render={({ field }) =>
                            <StyledTextField
                                placeholder={user?.username}
                                fullWidth
                                size='small'
                                {...field}
                                error={!!errors.username}
                                helperText={errors.username?.message}
                                InputProps={{
                                    endAdornment: loading && <CircularProgress color={'secondary'} size={24} />
                                }}
                            />
                        }
                    />
                </CardContent>
                <StyledCardActions>
                    <Button
                        type={'submit'}
                        variant={'contained'}
                        color='secondary'
                    >
                        Spara ändringar
                    </Button>
                </StyledCardActions>
            </Card>
        </Grid>
    </StyledFlexGrid>;
};
