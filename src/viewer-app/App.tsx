import { styled } from '@mui/material';
import { useEffect } from 'react';
import { useWindowSize } from 'usehooks-ts';
import { VideoContainer } from '../components/video/VideoContainer';
import { ConnectionStatus, getConnectionStatus } from '../store/app';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { ConnectMenu } from './ConnectMenu';
import { cleanup, init } from './store/viewerMiddleware';

const Container = styled('div')({
    flexGrow: 1,
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    alignItems: 'center'
});

const App = () => {
    const connectionStatus = useAppSelector(getConnectionStatus);
    const { width, height } = useWindowSize();
    

    return <Container>
        {connectionStatus !== ConnectionStatus.IDLE && <VideoContainer parentWidth={width} parentHeight={height} /> }

        <ConnectMenu />
    </Container>;
};

export { App };

