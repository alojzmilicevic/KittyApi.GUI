import { Logout } from "@mui/icons-material";
import {
    Divider,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import React from "react";
import { NavLink } from "react-router-dom";
import { getUser } from "../../store/app";
import { useAppSelector } from "../../store/hooks";

const stringAvatar = (name: string) => ({
    sx: {
        fontSize: 16,
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
});

const paperProps = {
    elevation: 0,
    sx: {
        overflow: "visible",
        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
        mt: 1.5,
        "& .MuiAvatar-root": {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
        },
        "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
        },
    },
};

type MenuOption = {
    text: string;
    path: string;
    icon: any;
    onClick?: () => void;
    showBottomBorder?: boolean;
};

function useNavMenu(logout: () => void) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const user = useAppSelector(getUser);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const menuOptions: MenuOption[] = [
        /*{ text: 'Profile', path: '/profile', icon: <Avatar />, showBottomBorder: true },*/
        {
            text: "Logout",
            path: "/login",
            icon: <Logout fontSize="small" />,
            onClick: logout,
        },
    ];

    return { anchorEl, open, handleClose, handleClick, menuOptions, user };
}

type NavMenuProps = {
    logout: () => void;
};

const NavMenu = ({ logout }: NavMenuProps) => {
    const { anchorEl, open, handleClose, handleClick, menuOptions, user } =
        useNavMenu(logout);

    return (
        <>
            <IconButton onClick={handleClick}>
                <Avatar
                    {...stringAvatar(`${user?.firstName} ${user?.lastName}`)}
                />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={paperProps}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                {menuOptions.map((option: MenuOption, i) => (
                    <div key={`menu option ${i}`}>
                        <MenuItem
                            component={NavLink}
                            to={option.path}
                            onClick={option.onClick}
                        >
                            <ListItemIcon>{option.icon}</ListItemIcon>
                            {option.text}
                        </MenuItem>
                        {option.showBottomBorder && <Divider />}
                    </div>
                ))}
            </Menu>
        </>
    );
};

export { NavMenu };
