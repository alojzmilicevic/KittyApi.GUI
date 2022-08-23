import Box from "@mui/material/Box";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from "react-router-dom";
import { UserModel } from "../user/UserModel";

interface Props {
    user: UserModel | null,
    logout: () => void,
}

const Navigation = ({ user, logout }: Props) => {
    return <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon/>
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    News
                </Typography>
                {user?.role === "Administrator" && <Button color="inherit" component={NavLink} to={"/admin"}>
                  Admin
                </Button>}
                {user && <Button color="inherit" component={NavLink} to={"/client"}>
                  Client
                </Button>}
                <Button color="inherit" component={NavLink} to={"/login"} onClick={logout}>
                    {user ? "Logout" : "Login"}
                </Button>
            </Toolbar>
        </AppBar>
    </Box>
}

export { Navigation };
