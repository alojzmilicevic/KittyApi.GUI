import { Button, styled } from "@mui/material";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useWindowSize } from "usehooks-ts";
import { ConnectionStatus, getConnectionStatus, getStreamInfo } from "../../../store/app";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { VideoContainer } from "../../../video/VideoContainer";
import { useSetShowStreams } from "../../module/Streams";
import { connectToStream, fetchStreamInfo, leaveStream } from "../../store/viewerMiddleware";

function useStream() {
    const { width, height } = useWindowSize();
    const params = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { setShowStreams } = useSetShowStreams();

    const connectionStatus = useAppSelector(getConnectionStatus);
    const streamInfo = useAppSelector(getStreamInfo);

    const { stream } = params as { stream: string };
    useEffect(() => {
        setShowStreams(false);
        dispatch(fetchStreamInfo({ streamId: stream }));
    }, [dispatch, stream]);

    useEffect(() => {
        if (streamInfo) {
            dispatch(connectToStream());
        }
    }, [streamInfo]);


    return {
        connectionStatus, leaveStream: () => {
            setShowStreams(true);
            dispatch(leaveStream());
            return navigate('/');
        }, width, height
    };
}

const Container = styled('div')({
    flexGrow: 1,
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    alignItems: 'center'
});

const Stream = () => {
    const { connectionStatus, leaveStream, width, height } = useStream();

    return (
        <Container>
            {connectionStatus !== ConnectionStatus.IDLE && <VideoContainer parentWidth={width} parentHeight={height} />}
            {connectionStatus === ConnectionStatus.CONNECTED &&
                <Button variant={'contained'} onClick={leaveStream}>
                    Leave Stream
                </Button>
            }
        </Container>
    );
}

export { Stream };

