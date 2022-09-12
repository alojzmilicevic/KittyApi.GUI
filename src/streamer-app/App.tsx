import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { cleanup, init } from './store/streamerMiddleware';
import { VideoContainer } from '../components/video/VideoContainer';
import { ChatDrawer } from '../components/chat-drawer/ChatDrawer';
import { useChatDrawer } from '../components/chat-drawer/hooks/useChatDrawer';
import { default as Grid } from '@mui/material/Unstable_Grid2';
import { useMediaQuery, useTheme } from '@mui/material';

const App = () => {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const smallScreen = useMediaQuery(theme.breakpoints.down('md'));

    // TODO maybe don't do this if we are in small screen??
    const drawerOptions = useChatDrawer();
    const { containerWidth, height } = drawerOptions;

    useEffect(() => {
        dispatch(init());

        return () => {
            dispatch(cleanup());
        };
    }, [dispatch]);


    return <Grid container>
        <Grid style={{ display: 'flex', justifyContent: 'center', width: containerWidth }}>
            <VideoContainer parentWidth={containerWidth} parentHeight={height} />
        </Grid>

        {!smallScreen && <ChatDrawer direction={theme.direction} {...drawerOptions} />}
        {smallScreen && <Grid xs={12} sx={{ backgroundColor: 'red', height: 63 }} />}
    </Grid>;
};

export { App };
