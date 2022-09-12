import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { cleanup, init } from './store/viewerMiddleware';
import { styled } from '@mui/material';
import { ConnectMenu } from './ConnectMenu';
import { ConnectionStatus, getConnectionStatus } from '../store/app';
import { VideoContainer } from '../components/video/VideoContainer';
import { useWindowSize } from 'usehooks-ts';

const Container = styled('div')({
    flexGrow: 1,
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    alignItems: 'center'
});

const App = () => {
    const dispatch = useAppDispatch();
    const connectionStatus = useAppSelector(getConnectionStatus);
    const { width, height } = useWindowSize();
    useEffect(() => {
        dispatch(init());

        return () => {
            dispatch(cleanup());
        };
    }, [dispatch]);


    return <Container>
        {connectionStatus !== ConnectionStatus.IDLE && <VideoContainer parentWidth={width} parentHeight={height} /> }

        <ConnectMenu />
    </Container>;
};

export { App };
