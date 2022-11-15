import { styled } from '@mui/material';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Login } from './authentication/module/LoginForm';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorView } from './errors/module/ErrorView';
import './index.css';
import { Navigation } from './navigation/module/Navigation';
import { ProfilePage } from './profile-page/module/ProfilePage';
import { StreamerApp } from './streamer-app/module/StreamerApp';
import { useApp } from './useApp';
import { UserModel } from './user/UserModel';
import { App as ViewerApp } from './viewer-app/App';
import { Stream } from './viewer-app/streams/Stream';
import { Streams } from './viewer-app/streams/Streams';

const MainContainer = styled('div')({
    height: '100%',
    overflow: 'hidden',
});

type ProtectedRouteProps = {
    user?: UserModel;
    redirectPath?: string;
};

const ProtectedRoute = ({
    user,
    redirectPath = '/login',
}: ProtectedRouteProps) => {
    if (!user) {
        return <Navigate to={redirectPath} replace />;
    }
    return <Outlet />;
};

const RedirectRoute = ({ user, redirectPath = '/' }: ProtectedRouteProps) => {
    if (user) {
        return <Navigate to={redirectPath} replace />;
    }
    return <Outlet />;
};

function App() {
    const { user, ready, logout, error } = useApp();


    return (
        <>
            <ErrorView />
            <MainContainer>
                <Navigation loading={!ready} user={user} logout={logout} />
                <LoadingSpinner />
                {ready && !error && (
                    <Routes>
                        <Route element={<ProtectedRoute user={user} />}>
                            <Route element={<StreamerApp />} path={'/streamer'} />
                            <Route element={<ProfilePage />} path={'/profile'} />
                            <Route element={<ViewerApp />} path={'/'} />
                            <Route element={<Streams />} path={'/streams'}></Route>
                            <Route element={<Stream />} path={'/streams/:stream'} />

                        </Route>
                        <Route element={<RedirectRoute user={user} />}>
                            <Route element={<Login />} path={'/login'} />
                            <Route element={<Navigate to={'login'} />} path={'*'} />
                        </Route>
                    </Routes>
                )}
            </MainContainer>
        </>
    );
}

export default App;
