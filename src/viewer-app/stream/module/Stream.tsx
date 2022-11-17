import { Button, styled } from "@mui/material";
import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useWindowSize } from "usehooks-ts";
import { VideoContainer } from "../../../video/VideoContainer";
import { ConnectionStatus, getConnectionStatus, getStreamInfo } from "../../../store/app";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { cleanup, connectToStream, init, leaveStream } from "../../store/viewerMiddleware";

function useStream() {
    const { width, height } = useWindowSize();
    const params = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const connectionStatus = useAppSelector(getConnectionStatus);
    const streamInfo = useAppSelector(getStreamInfo);

    const { stream } = params as { stream: string };
    useEffect(() => {
        dispatch(init({ streamId: stream }));

        return () => {
            dispatch(cleanup());
        }
    }, [dispatch, stream]);

    useEffect(() => {
        if (streamInfo) {
            dispatch(connectToStream());
        }
    }, [dispatch, streamInfo]);

    const onLeaveStream = useCallback(
        () => {
            navigate('/');
            dispatch(leaveStream());
        },
        [dispatch, navigate],
    )

    return { connectionStatus, leaveStream: onLeaveStream, width, height };
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

