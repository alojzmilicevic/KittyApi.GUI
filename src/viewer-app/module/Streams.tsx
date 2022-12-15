import { Box, Typography } from '@mui/material';
import { default as Grid } from '@mui/material/Unstable_Grid2';
import { useEffect, useState } from 'react';
import { Outlet, useOutletContext, useParams } from 'react-router-dom';
import { AppStatus, getAppStatus, getError, setAppStatus } from '../../store/app';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { StreamCard } from '../components/StreamCard';
import { Stream } from '../interface';
import * as ViewerService from '../service/viewerService';
import { cleanup, init } from '../store/viewerMiddleware';

function useStreams() {
    const [streams, setStreams] = useState<Stream[]>([]);
    const dispatch = useAppDispatch();


    useEffect(() => {
        const fetchStreams = async () => {
            dispatch(setAppStatus(AppStatus.FETCHING_STREAMS));
            const streams = await ViewerService.getStreams();
            setStreams(streams);
            dispatch(setAppStatus(AppStatus.FETCHED_STREAMS));
        };

        fetchStreams();

    }, []);


    return { streams };
}

const NoStreamsView = () => <Box sx={{ p: 4 }}>
    <Typography variant='h3'>No streams available</Typography>
</Box>

const Streams = () => {
    const dispatch = useAppDispatch();
    const { streams } = useStreams();
    const [showStreams, setShowStreams] = useState(true);
    const appStatus = useAppSelector(getAppStatus);
    const error = useAppSelector(getError);
    const params = useParams();
    const { stream } = params as { stream: string };

    useEffect(() => {
        dispatch(init());

        return () => {
            dispatch(cleanup());
        }
    }, []);
    
    const showStream = appStatus !== AppStatus.INITIALIZING && appStatus !== AppStatus.IDLE;
    const canShowNoStreamsView = (appStatus === AppStatus.FETCHED_STREAM_INFO || !stream) && !error;

    if (streams?.length === 0) {
        return <>
            {showStream && <Outlet context={{ setShowStreams: (shouldShow: boolean) => setShowStreams(shouldShow) }} />}
            {canShowNoStreamsView && <NoStreamsView />}
        </>
    }


    return (
        <>
            {showStream && <Outlet context={{ setShowStreams: (shouldShow: boolean) => setShowStreams(shouldShow) }} />}
            {showStreams &&
                <Grid
                    container
                    spacing={{ xs: 2 }}
                    columns={{ xs: 4, sm: 6 }}
                    style={{ padding: 16 }}
                >
                    {streams.map((stream: Stream, index) => (
                        <Grid style={{ maxWidth: 350 }} xs={12} key={index}>
                            <StreamCard setShowStreams={() => setShowStreams(false)} stream={stream} />
                        </Grid>
                    ))}
                </Grid>
            }
        </>

    );
};

type ContextType = { setShowStreams: (shouldShowStreams: boolean) => void };
export const useSetShowStreams = () => useOutletContext<ContextType>();

export { Streams };

