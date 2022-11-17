import ChatIcon from '@mui/icons-material/Chat';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GroupIcon from '@mui/icons-material/Group';
import { Drawer, IconButton, styled, Tooltip, Typography } from '@mui/material';
import { default as Grid } from '@mui/material/Unstable_Grid2/Grid2';
import { useState } from 'react';
import { NavbarOffset } from '../../navigation/module/Navigation';
import { getStreamInfo } from '../../store/app';
import { useAppSelector } from '../../store/hooks';
import { UserModel } from '../../user/UserModel';

const OpenDrawerButton = styled(IconButton, {
    shouldForwardProp: (prop) => prop !== 'open'
})<{ open: boolean }>(({ open }) => ({
    ...(open && { display: 'none' }),
    backgroundColor: 'rgba(0, 0, 0, 0.16)',
    position: 'absolute',
    right: 0,
    width: 32,
    height: 32,
    color: 'white',
    top: 64,
}));

const StyledDrawer = styled(Drawer, {
    shouldForwardProp: (prop) => prop !== 'drawerWidth'
})<{ drawerWidth: number }>(({ drawerWidth, theme }) => ({
    width: drawerWidth,
    [`& .MuiDrawer-paper`]: {
        width: drawerWidth,
        boxSizing: 'border-box',
        padding: '8px 4px',
        backgroundColor: theme.palette.primary.main,
    }
}));

type DrawerHeaderProps = {
    handleDrawerClose: () => void,
    setView: (view: ViewType) => void,
    view: ViewType,
}


//TODO Maybe move this to a separate file
enum ViewType {
    USERS_VIEW = 'users',
    CHAT_VIEW = 'chat',
}

const DrawerHeader = ({ handleDrawerClose, view, setView }: DrawerHeaderProps) =>
    <Grid xs={12} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <IconButton onClick={handleDrawerClose}>
            <ChevronRightIcon />
        </IconButton>
        <Typography>
            Stream Chat
        </Typography>
        {view === ViewType.CHAT_VIEW ?
            < Tooltip title={'Show users'}>
                <IconButton onClick={() => setView(ViewType.USERS_VIEW)}>
                    <GroupIcon />
                </IconButton>
            </Tooltip>
            :
            <Tooltip title={'Show chat'}>
                <IconButton onClick={() => setView(ViewType.CHAT_VIEW)}>
                    <ChatIcon />
                </IconButton>
            </Tooltip>
        }
    </Grid>;

type ChatDrawerProps = {
    open: boolean,
    handleDrawerOpen: () => void,
    handleDrawerClose: () => void,
    drawerWidth: number,
    smallScreen: boolean,
}

export const ChatDrawer = ({ open, drawerWidth, handleDrawerClose, handleDrawerOpen, smallScreen }: ChatDrawerProps) => {
    const users = useAppSelector(getStreamInfo)?.users;
    const [view, setView] = useState<ViewType>(ViewType.CHAT_VIEW);
    const anchor = smallScreen ? 'bottom' : 'right';

    return (
        <>
            <OpenDrawerButton open={open} onClick={handleDrawerOpen}>
                <ChevronLeftIcon />
            </OpenDrawerButton>
            <StyledDrawer
                variant='persistent'
                anchor={anchor}
                open={open}
                drawerWidth={drawerWidth}
            >
                {anchor === 'right' && <NavbarOffset />}

                <Grid container>
                    <DrawerHeader handleDrawerClose={handleDrawerClose} view={view} setView={setView}/>

                    <Grid xs={12}>
                        <Typography>Users</Typography>
                        {users?.map((user: UserModel, i) => <Typography key={`${i} ${user.username}`}
                            variant={'body1'}>{`${user.firstName} ${user.lastName}`}</Typography>)}
                    </Grid>
                </Grid>
            </StyledDrawer>
        </>
    );
};
