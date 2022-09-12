import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { cleanup, init } from './store/streamerMiddleware';
import { VideoContainer } from '../components/video/VideoContainer';
import { ChatDrawer } from '../components/ChatDrawer/ChatDrawer';
import { useChatDrawer } from '../components/ChatDrawer/hooks/useChatDrawer';
import { default as Grid } from '@mui/material/Unstable_Grid2';
import { useMediaQuery, useTheme } from '@mui/material';

const App = () => {
    const dispatch = useAppDispatch();
    const drawerOptions = useChatDrawer();
    const { containerWidth, height } = drawerOptions;
    const theme = useTheme();
    const smallScreen = useMediaQuery(theme.breakpoints.down('md'));

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
