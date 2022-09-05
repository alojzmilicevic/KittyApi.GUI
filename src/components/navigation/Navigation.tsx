import Box from "@mui/material/Box";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { UserModel } from "../../streamer-app/user/UserModel";
import cat from '../../assets/img/svgtobe.svg';

interface Props {
    user: UserModel | null,
    logout: () => void,
}

const Navigation = ({ user, logout }: Props) => {
    return <Box>
        <AppBar position="static">
            <Toolbar>
                <IconButton disableRipple size={"small"}>
                    <img style={{width: 40, height: 40}} alt="a" src={cat}></img>
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    KittyIO
                </Typography>
                {user?.role === "Administrator" && <Button color="inherit" component={NavLink} to={"/streamer"}>
                  Streamer
                </Button>}
                {user && <Button color="inherit" component={NavLink} to={"/viewer"}>
                  View
                </Button>
                }
                <Button color="inherit" component={NavLink} to={"/login"} onClick={logout}>
                    {user ? "Logout" : "Login"}
                </Button>
            </Toolbar>
        </AppBar>
    </Box>
}

export { Navigation };
