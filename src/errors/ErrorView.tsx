import styled from "@emotion/styled";
import { Button, Typography, useTheme } from "@mui/material";
import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resourcesUrl } from "../authentication/authentication";
import { getError, setError } from "../store/app";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const Container = styled('div')({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    flexDirection: 'column',
});

const PreInline = styled('pre')({
    margin: 0,
});

const ErrorView = () => {
    const appError = useAppSelector(getError);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const location = useLocation();
    const clearError = useCallback(() => {
        dispatch(setError(undefined));
    }, [dispatch]);

    useEffect(() => {
        clearError();
    }, [clearError, dispatch, location]);

    if (!appError) {
        return null;
    }

    const onActionClick = () => {
        clearError();
        navigate(appError.action, { replace: true });
    }

    return (
        <Container>
            <img src={`${resourcesUrl}/Resources/Images/404-cat.png`} alt="error" />
            <Typography variant="h4" style={{ display: 'flex' }}>
                <PreInline> {appError.error.message}... </PreInline>
            </Typography>
            <Typography sx={{ display: 'flex', color: theme.palette.error.main, fontFamily: 'monospace' }}>
                Error Code: {appError.error.type}
            </Typography>
            <Button
                sx={{ mt: 4 }}
                variant="contained"
                color={'secondary'}
                onClick={onActionClick}>
                {appError.label}
            </Button>
        </Container>
    );
};

export { ErrorView };

