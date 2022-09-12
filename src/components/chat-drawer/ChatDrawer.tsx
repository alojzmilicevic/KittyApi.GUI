import { Divider, Drawer, IconButton, styled, Tooltip } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { default as Grid } from '@mui/material/Unstable_Grid2/Grid2';
import Typography from '@mui/material/Typography';
import { UserModel } from '../../streamer-app/user/UserModel';
import { useAppSelector } from '../../store/hooks';
import { getStreamInfo } from '../../store/app';
import GroupIcon from '@mui/icons-material/Group';
import { useState } from 'react';
import ChatIcon from '@mui/icons-material/Chat';

const TopPadding = styled('div')(({ theme }) => ({
    // necessary for content to be below app bar
    ...theme.mixins.toolbar
}));

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
    top: 64
}));

type DrawerHeaderProps = {
    direction: string,
    handleDrawerClose: () => void,
    setView: (view: ViewType) => void,
    view: ViewType,
}

enum ViewType {
    USERS_VIEW = 'users',
    CHAT_VIEW = 'chat',
}

const DrawerHeader = ({ direction, handleDrawerClose, view, setView }: DrawerHeaderProps) =>
    <Grid xs={12} display={'flex'} justifyContent={'space-between'} alignItems={'center'}
          sx={{ padding: 1 }}>
        <IconButton onClick={handleDrawerClose}>
            {direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
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
    direction: string,
    drawerWidth: number,
    handleDrawerOpen: () => void,
    handleDrawerClose: () => void,
}

export const ChatDrawer = ({ open, direction, drawerWidth, handleDrawerOpen, handleDrawerClose }: ChatDrawerProps) => {
    const users = useAppSelector(getStreamInfo)?.users;
    const [view, setView] = useState<ViewType>(ViewType.CHAT_VIEW);

    return (
        <>
            <OpenDrawerButton open={open} onClick={handleDrawerOpen}>
                {direction === 'rtl' ? < ChevronRightIcon /> : <ChevronLeftIcon />}
            </OpenDrawerButton>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: 'primary.main'
                    }
                }}
                variant='persistent'
                anchor='right'
                open={open}
            >
                <TopPadding />

                <Grid container>
                    <DrawerHeader direction={direction} handleDrawerClose={handleDrawerClose} view={view}
                                  setView={setView} />
                    <Divider style={{ width: '100%' }} />


                    <Grid xs={12}>
                        <Typography variant={'subtitle1'}>Users</Typography>
                        {users?.map((user: UserModel, i) => <Typography key={`${i} ${user.username}`}
                                                                        variant={'body1'}>{`${user.firstName} ${user.lastName}`}</Typography>)}
                    </Grid>
                </Grid>
            </Drawer>
        </>
    );
};
