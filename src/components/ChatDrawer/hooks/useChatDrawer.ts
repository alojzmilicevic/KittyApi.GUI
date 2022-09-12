import { useState } from 'react';
import { useWindowSize } from 'usehooks-ts';

const drawerWidth = 340;

export function useChatDrawer() {
    const { width, height } = useWindowSize();
    const [open, setOpen] = useState(false);

    const containerWidth = open ? width - drawerWidth : width;

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return {
        open,
        height,
        drawerWidth,
        containerWidth,
        handleDrawerOpen,
        handleDrawerClose
    };
}
