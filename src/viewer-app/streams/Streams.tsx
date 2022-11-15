import { default as Grid } from '@mui/material/Unstable_Grid2';
import { useEffect, useState } from 'react';
import { getStreams } from '../api/stream';
import { StreamCard } from './StreamCard';

export interface Thumbnail {
    thumbnailId: string;
    thumbnailName: string;
    thumbnailPath: string;
}

export interface Stream {
    streamId: string;
    streamTitle: string;
    streamerName: string;
    thumbnail: Thumbnail;
    streamerUsername: string;
}

// TODO: Add skeleton loading
const Streams = () => {
    const [streams, setStreams] = useState<Stream[]>([]);

    useEffect(() => {
        getStreams().then((res) => {
            setStreams(res);
        });
    }, []);


    if (streams.length < 1) return null;

    return (
        <Grid
            container
            spacing={{ xs: 2 }}
            columns={{ xs: 4, sm: 6 }}
            style={{ padding: 16 }}
        >
            {streams.map((stream: Stream, index) => (
                <Grid style={{ maxWidth: 350 }} xs={2} key={index}>
                    <StreamCard stream={stream} />
                </Grid>
            ))}
        </Grid>
    );
};

export { Streams };

