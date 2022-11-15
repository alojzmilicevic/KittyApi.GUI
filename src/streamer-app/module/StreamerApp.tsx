import { default as Grid } from '@mui/material/Unstable_Grid2';
import { useEffect } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { VideoContainer } from '../../video/VideoContainer';
import { StreamControl } from '../components/StreamControl';
import { cleanup, init } from '../store/streamerMiddleware';

function useStreamerApp() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(init());

        return () => {
            dispatch(cleanup());
        };
    }, [dispatch]);
}

const StreamerApp = () => {
    useStreamerApp();

    return <Grid container justifyContent={'center'}>
        <Grid xs={11} md={4}>
            <VideoContainer />
            <StreamControl />
        </Grid>
    </Grid>
}

export { StreamerApp };

