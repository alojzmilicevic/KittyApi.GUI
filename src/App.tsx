import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Login } from './authentication/login/LoginForm';
import { Navigation } from './components/navigation/Navigation';
import { useApp } from './useApp';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { App as StreamerApp } from './streamer-app/App';
import { App as ViewerApp } from './viewer-app/App';
import { styled } from '@mui/material';
import './index.css';
import { LoadingSpinner } from './components/LoadingSpinner';

const theme = createTheme({
    palette: {
        primary: {
            main: '#212121'
        },
        secondary: {
            main: '#c8e6c9'
        }
    }
});

const MainContainer = styled('div')({
    display: 'flex',
    height: '100%',
    flexFlow: 'column'
});

function App() {
    const { user, ready, logout } = useApp();

    return <ThemeProvider theme={theme}>
        <MainContainer>
            <Navigation loading={!ready} user={user} logout={logout} />
            <LoadingSpinner />
            {ready &&
                <Routes>
                    <Route
                        element={user ? <Navigate replace to='/' /> : <Login />}
                        path={'/login'}
                    />
                    <Route
                        path={'/streamer'}
                        element={user ? <StreamerApp /> : <Navigate to={'/login'} replace />}
                    />

                    <Route
                        path='*'
                        element={<Navigate to={user ? '/' : '/login'} />}
                    />
                    <Route
                        path={'/'}
                        element={user ? <ViewerApp /> : <Navigate to={'/login'} replace />}
                    />
                </Routes>
            }
        </MainContainer>
    </ThemeProvider>;
}

export default App;
