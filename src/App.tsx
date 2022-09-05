import React from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./authentication/login/LoginForm";
import { Navigation } from "./components/navigation/Navigation";
import { useApp } from "./useApp";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { App as StreamerApp } from "./streamer-app/App";
import { App as ViewerApp } from "./viewer-app/App";
import { styled } from "@mui/material";
import './index.css'
import { LoadingSpinner } from "./components/LoadingSpinner";

const theme = createTheme();

const MainContainer = styled('div')({
    display: "flex",
    height: '100%',
    flexFlow: 'column',
});

function App() {
    const { user, ready, logout, setUser } = useApp();

    return <ThemeProvider theme={theme}>
        <MainContainer>
            <Navigation user={user} logout={logout}/>
            <LoadingSpinner />
            {ready &&
                <Routes>
                  <Route element={user ? <Navigate replace to="/streamer"/> : <Login setUser={setUser}/>}
                         path={"/login"}/>
                  <Route path={"/streamer"} element={user ? <StreamerApp/> : <Navigate to={'/login'} replace/>}/>
                  <Route path={"/viewer"} element={user ? <ViewerApp/> : <Navigate to={'/login'} replace/>}/>
                  <Route path="*" element={<Navigate to={user?.role === 'Administrator' ? '/streamer' : '/login'}/>}/>
                </Routes>

            }
        </MainContainer>
    </ThemeProvider>
}

export default App;
