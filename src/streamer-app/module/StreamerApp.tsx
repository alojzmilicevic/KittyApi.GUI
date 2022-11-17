import { Box, styled } from '@mui/material';
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
    display: 'flex',
    justifyContent: 'center',
});

const StyledBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'containerWidth',
})<{ containerWidth: number }>(({ containerWidth, theme }) => ({
    width: containerWidth,
    [theme.breakpoints.up('sm')]: {
        paddingTop: theme.spacing(2),
    }
}));

const CenterGrid = styled(Grid)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
});

const StreamerApp = () => {
    useStreamerApp();
    const drawerOptions = useChatDrawer();
    const containerWidth = drawerOptions.containerWidth;

    return <StyledBox containerWidth={containerWidth}>
        <StyledGrid container>
            <CenterGrid xs={12} sm={10} md={7} lg={6}>
                <VideoContainer />

                <Grid xs={12} sm={8} display={'flex'} alignItems={'center'} flexDirection={'column'} sx={{ p: 2 }}>
                    <StreamControl />
                </Grid>
            </CenterGrid>
        </StyledGrid>
        <ChatDrawer {...drawerOptions} />

    </StyledBox>
}

export { StreamerApp };

