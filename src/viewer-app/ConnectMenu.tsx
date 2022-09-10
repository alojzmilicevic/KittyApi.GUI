import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { ConnectionStatus, getConnectionStatus, getStreamInfo } from '../store/app';
import { UserModel } from '../streamer-app/user/UserModel';
import Grid from '@mui/material/Unstable_Grid2';
import { connectToStream, leaveStream } from './store/viewerMiddleware';

const ParticipantInformation = () => {
    const streamInfo = useAppSelector(getStreamInfo);
    const { users } = streamInfo || {};

    const ParticipantList = () => <>
        <Grid xs={12} display={'flex'} alignItems={'center'} justifyContent={"center"}>
            <Typography variant={'subtitle2'}>Participants</Typography>
        </Grid>
        <Grid xs={12} display={'flex'} alignItems={'center'} justifyContent={"center"}>
            {users?.map((user: UserModel, index: number) =>
                <Typography key={`participant ${index + 1}`} variant={"body1"}>
                    {`${user.firstName} ${user.lastName}`}
                </Typography>
            )}
        </Grid>
    </>

    return users && users?.length > 0 ? <ParticipantList/> : <Grid xs={12} display={'flex'} justifyContent={'center'}>
        <Typography variant={'body1'}> There is no one else here </Typography>
    </Grid>
}


export const ConnectMenu = () => {
    const dispatch = useAppDispatch();
    const connectionStatus = useAppSelector(getConnectionStatus);

    return (
        <Grid container spacing={2}>
            {connectionStatus === ConnectionStatus.IDLE &&
                <>
                  <Grid xs={12} display={'flex'} justifyContent={'center'}>
                    <Typography variant={'h4'}>
                      Ready to join?
                    </Typography>
                  </Grid>
                  <ParticipantInformation/>
                </>
            }
            <Grid xs={12} display={'flex'} alignItems={"center"} justifyContent={'center'}>
                {connectionStatus === ConnectionStatus.IDLE &&
                    <Button
                        sx={{ textTransform: 'none' }}
                        variant={"contained"}
                        onClick={() => dispatch(connectToStream())}
                    >
                      Join Stream
                    </Button>
                }
                {connectionStatus === ConnectionStatus.CONNECTED &&
                    <Button
                        sx={{ textTransform: 'none' }}
                        variant={'contained'}
                        onClick={() => dispatch(leaveStream())}
                    >
                      Leave Stream
                    </Button>
                }
            </Grid>
        </Grid>
    )
}
