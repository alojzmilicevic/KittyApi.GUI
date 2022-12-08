import { default as Grid } from '@mui/material/Unstable_Grid2';
import { useEffect, useState } from 'react';
import * as ViewerService from '../service/viewerService';
import { StreamCard } from '../components/StreamCard';
import { Stream } from '../interface';
import { Box, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { cleanup, init } from '../store/viewerMiddleware';

function useStreams() {
    const [streams, setStreams] = useState<Stream[]>([]);

    useEffect(() => {
        const fetchStreams = async () => {
            const streams = await ViewerService.getStreams();
            setStreams(streams);
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

    useEffect(() => {
        dispatch(init());

        return () => {
            dispatch(cleanup());
        }
    }, []);

    if (streams.length === 0) {
        return <NoStreamsView />
    }

    return (
        <>
            <Outlet context={{setShowStreams: (shouldShow: boolean) => setShowStreams(shouldShow)}}/>
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

export { Streams };

