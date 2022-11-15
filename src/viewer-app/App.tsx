import { styled } from '@mui/material';
import { useWindowSize } from 'usehooks-ts';
import { VideoContainer } from '../components/video/VideoContainer';
import { ConnectionStatus, getConnectionStatus } from '../store/app';
import { useAppSelector } from '../store/hooks';
import { ConnectMenu } from './ConnectMenu';

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

