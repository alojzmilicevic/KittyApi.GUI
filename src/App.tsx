import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Login } from './authentication/login/LoginForm';
import { Navigation } from './components/navigation/Navigation';
import { useApp } from './useApp';
import { App as StreamerApp } from './streamer-app/App';
import { App as ViewerApp } from './viewer-app/App';
import { styled } from '@mui/material';
import './index.css';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ProfilePage } from './profile-page/ProfilePage';
import { UserModel } from './streamer-app/user/UserModel';

const MainContainer = styled('div')({
    height: '100%'
});

type ProtectedRouteProps = {
    user?: UserModel,
    redirectPath?: string,
}

const ProtectedRoute = ({ user, redirectPath = '/login' }: ProtectedRouteProps) => {
    if (!user) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

function App() {
    const { user, ready, logout } = useApp();

    return <MainContainer>
            <Navigation loading={!ready} user={user} logout={logout} />
            <LoadingSpinner />
            {ready &&
                <Routes>
                    <Route element={<ProtectedRoute user={user} />}>
                        <Route element={<StreamerApp />} path={'/streamer'}/>
                        <Route element={<ProfilePage />} path={'/profile'}/>
                        <Route element={<ViewerApp />} path={'/'}/>
                    </Route>
                    <Route element={user ? <Navigate to={'/'} />: <Login />} path={'/login'}/>
                    <Route
                        path='*'
                        element={<Navigate to={user ? '/' : '/login'} />}
                    />
                </Routes>
            }
        </MainContainer>
}

export default App;
