import { Stop } from '@mui/icons-material';
import { Button, styled, useMediaQuery, useTheme } from '@mui/material';
import { default as Grid } from '@mui/material/Unstable_Grid2';
import { useEffect } from 'react';
import { ChatDrawer } from '../components/chat-drawer/ChatDrawer';
import { useChatDrawer } from '../components/chat-drawer/hooks/useChatDrawer';
import { VideoContainer } from '../components/video/VideoContainer';
import { getStreamInfo } from '../store/app';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { StartStreamForm } from './StartStreamForm';
import { cleanup, endStream, init } from './store/streamerMiddleware';

export interface StartStreamInput {
    title: string;
    thumbnail: number;
}

const StreamSettings = () => {
    const dispatch = useAppDispatch();
    const streamInfo = useAppSelector(getStreamInfo);

    return <>
        {!streamInfo && <StartStreamForm />}
        {streamInfo && <Button size={'small'} variant='contained' color='secondary' sx={{ mt: 2 }} fullWidth endIcon={<Stop />} onClick={() => dispatch(endStream())}>Stop Stream</Button>}
    </>
}

const App = () => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const smallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const drawerOptions = useChatDrawer();


    useEffect(() => {
        dispatch(init());

        return () => {
            dispatch(cleanup());
        };
    }, [dispatch]);


    return <Grid container sx={{ mt: 4 }}>
        <Grid sx={{ width: drawerOptions.containerWidth }} justifyContent={'center'} display={'flex'}>
            <Grid xs={6} justifyContent={'center'} alignItems={'center'} display={'flex'} flexDirection={'column'}>
                <VideoContainer />
                <StreamSettings />
            </Grid>
        </Grid>
        {!smallScreen && <ChatDrawer direction={theme.direction} {...drawerOptions} />}
        {smallScreen && <Grid xs={12} sx={{ backgroundColor: 'red', height: 63 }} />}

    </Grid>
}

export { App };

