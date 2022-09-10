import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { cleanup, init } from './store/viewerMiddleware';
import { styled } from "@mui/material";
import { ConnectMenu } from './ConnectMenu';
import { ConnectionStatus, getConnectionStatus } from "../store/app";

const Container = styled('div')({
    flexGrow: 1,
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    alignItems: 'center',
});

const App = () => {
    const dispatch = useAppDispatch();
    const connectionStatus = useAppSelector(getConnectionStatus);

    useEffect(() => {
        dispatch(init());

        return () => {
            dispatch(cleanup())
        }
    }, [dispatch])


    return <Container>
        <video id="viewer-video" style={{visibility: connectionStatus === ConnectionStatus.CONNECTED ? 'visible' : 'hidden'}} autoPlay></video>

        <ConnectMenu />
    </Container>
}

export { App };
