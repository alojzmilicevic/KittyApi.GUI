import { styled } from "@mui/material";
import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useWindowSize } from "usehooks-ts";
import { VideoContainer } from "../../components/video/VideoContainer";
import { ConnectionStatus, getConnectionStatus, getStreamInfo } from "../../store/app";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { cleanup, connectToStream, init } from "../store/viewerMiddleware";
import { Stream as StreamType } from "./Streams";

const Container = styled('div')({
    flexGrow: 1,
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    alignItems: 'center'
});


const Stream = () => {
    const params = useParams();
    const dispatch = useAppDispatch();
    const { width, height } = useWindowSize();

    const connectionStatus = useAppSelector(getConnectionStatus);

    const streamInfo = useAppSelector(getStreamInfo);
    const { stream } = params as { stream: string };
    useEffect(() => {
        if (params.stream) {
            dispatch(init({ streamId: stream }));
            dispatch(connectToStream());

        }

        return () => {
            dispatch(cleanup());
        }
    }, [dispatch, params, stream]);



    return (
        <Container>
            {connectionStatus !== ConnectionStatus.IDLE && <VideoContainer parentWidth={width} parentHeight={height} />}
        </Container>
    );
}

export { Stream };

