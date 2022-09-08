import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { cleanup, init } from './store/streamerMiddleware';
import { getUsers } from './user/store/store';

const App = () => {
    const dispatch = useAppDispatch();
    const users = useAppSelector(getUsers);

    useEffect(() => {
        dispatch(init());

        return () => {
            dispatch(cleanup());
        };
    }, [dispatch]);


    return <div style={{ display: 'flex', flexDirection: 'column' }}>
        <video id='streamer-video' autoPlay></video>
        <p>Users</p>
        {users.map((u: string, index: number) => <p key={`${index}${u}`}>{u}</p>)}
    </div>;
};

export { App };
