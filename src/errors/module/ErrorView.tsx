import { useErrorView } from "../hooks/useErrorView";
import { Button, styled, Typography } from "@mui/material";
import { Sad404Cat } from "../../assets/Sad404Cat";

const Container = styled('div')({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
});

const StyledPre = styled('pre')({ margin: 0 });
const StyledTypography = styled(Typography)(({ theme }) => ({
    display: 'flex',
    color: theme.palette.error.main,
    fontFamily: 'monospace'
}));

const ErrorView = () => {
    const { appError, onActionClick } = useErrorView();

    if (!appError) {
        return null;
    }

    return (
        <Container>
            <Sad404Cat />
            <Typography variant="h4">
                <StyledPre> {appError.error.message}... </StyledPre>
            </Typography>
            <StyledTypography>
                Error Code: {appError.error.type}
            </StyledTypography>
            <Button
                sx={{ mt: 4 }}
                variant="contained"
                color={'secondary'}
                onClick={onActionClick}
            >
                {appError.label}
            </Button>
        </Container>
    );
};

export { ErrorView };

