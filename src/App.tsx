import React from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./authentication/login/LoginForm";
import { Navigation } from "./navigation/Navigation";
import { useApp } from "./useApp";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Client } from "./client/Client";

const theme = createTheme();

function App() {
    const { user, loading, logout, setUser } = useApp();

    return <ThemeProvider theme={theme}>
        <Navigation user={user} logout={logout}/>
        {!loading &&
            <Routes>
              <Route element={ user ? <Navigate replace to="/client" /> : <Login setUser={setUser}/>} path={"/login"} />
              <Route
                  path={"/admin"}
                  element={user ? <p>You are an {user?.role} {user?.firstName}</p> :
                      <Navigate to="/login" replace/>}
              />
              <Route path={"/client"} element={<Client />} />
              <Route path="*" element={<Navigate to={user?.role === 'Administrator' ? '/client' : '/login'}/>}/>
            </Routes>
        }
    </ThemeProvider>
}

export default App;
