import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { cleanup, init } from './store/streamerMiddleware';
import { getStreamInfo } from '../store/app';
import { UserModel } from './user/UserModel';
import Typography from '@mui/material/Typography';

const App = () => {
    const dispatch = useAppDispatch();
    const streamInfo = useAppSelector(getStreamInfo);
    const { users } = streamInfo || {};

    useEffect(() => {
        dispatch(init());

        return () => {
            dispatch(cleanup());
        };
    }, [dispatch]);


    return <>
        <video id='streamer-video' autoPlay></video>
        {users && users.map((user: UserModel, idx: number) =>
            <Typography
                key={`${idx} ${user.firstName}`}
                variant={'body1'}
            >
                {`${user.firstName} ${user.lastName}`}
            </Typography>
        )}
    </>;
};

export { App };
