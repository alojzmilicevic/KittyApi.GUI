import { styled } from '@mui/material';
import { default as Grid } from '@mui/material/Unstable_Grid2';
import { useEffect } from 'react';
import { useChatDrawer } from '../../chat/hooks/useChatDrawer';
import { useAppDispatch } from '../../store/hooks';
import { VideoContainer } from '../../video/VideoContainer';
import { StreamControl } from '../components/StreamControl';
import { cleanup, init } from '../store/streamerMiddleware';
import { ChatDrawer } from '../../chat/module/ChatDrawer';

function useStreamerApp() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(init());

        return () => {
            dispatch(cleanup());
        };
    }, [dispatch]);
}

const StyledGrid = styled(Grid)({
    justifyContent: 'center',
    padding: 16,
    display: 'flex',
});

const StreamerApp = () => {
    useStreamerApp();
    const drawerOptions = useChatDrawer();

    return <StyledGrid container columnGap={4}>
        <Grid xs={12} sm={10} md={8} lg={6} xl={4}>
            <VideoContainer />
            <StreamControl />
        </Grid>
        <Grid xs={12} lg={2} sx={{ backgroundColor: 'red' }}>
            <ChatDrawer {...drawerOptions} />
        </Grid>

    </StyledGrid>
}

export { StreamerApp };

