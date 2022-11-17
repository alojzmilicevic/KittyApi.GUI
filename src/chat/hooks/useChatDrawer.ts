import { useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import { useWindowSize } from 'usehooks-ts';

const drawerWidth = 340;

export function useChatDrawer() {
    const { width, height } = useWindowSize();
    const [open, setOpen] = useState(true);
    const theme = useTheme();
    const smallScreen = useMediaQuery(theme.breakpoints.down('lg'));

    const containerWidth = open && !smallScreen ? width - drawerWidth : width;

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return {
        open,
        height,
        drawerWidth: smallScreen ? width : drawerWidth,
        containerWidth,
        handleDrawerOpen,
        handleDrawerClose,
        smallScreen,
    };
}
