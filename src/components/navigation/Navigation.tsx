import Box from '@mui/material/Box';
import { AppBar, Button, IconButton, Skeleton, Toolbar, Tooltip, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { UserModel } from '../../streamer-app/user/UserModel';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React from 'react';
import { AppMenu } from './AppMenu';
import VideocamIcon from '@mui/icons-material/Videocam';
import { grey } from '@mui/material/colors';
import { CatIcon } from '../../assets/CatIcon';
import Grid from '@mui/material/Unstable_Grid2';

interface Props {
    user: UserModel | undefined;
    logout: () => void;
    loading: boolean;
}

const SkeletonContainer = () => {
    return <Grid container spacing={4}>
        <Grid>
            <Skeleton animation='wave' variant='circular' width={40} height={40} />
        </Grid>
        <Grid>
            <Skeleton animation='wave' variant='circular' width={40} height={40} />
        </Grid>
    </Grid>;
};

const Navigation = ({ user, logout, loading }: Props) => {
    return (
        <Box>
            <AppBar position='static'>
                <Toolbar style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <IconButton component={NavLink} to={'/'} disableRipple size={'small'}>
                            <CatIcon color={grey[500]} size={40} />
                        </IconButton>
                        <Typography
                            variant='h6'
                            component={NavLink}
                            to={'/'}
                            sx={{ textDecoration: 'none', color: 'primary.contrastText' }}
                        >
                            KittyIO
                        </Typography>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        {user &&
                            <Tooltip title={'Stream'}>
                                <IconButton sx={{ color: grey[200] }} component={NavLink} to={'/streamer'}>
                                    <VideocamIcon fontSize={'large'} />
                                </IconButton>
                            </Tooltip>
                        }

                        {!user && !loading &&
                            <Button
                                size={'large'}
                                color='inherit'
                                component={NavLink}
                                to={'/login'}
                                onClick={logout}
                                variant={'outlined'}
                                startIcon={<AccountCircleIcon sx={{ width: 24, height: 24 }} />}
                            >
                                {'Login'}
                            </Button>
                        }
                        {user && <AppMenu logout={logout} />}

                        {!user && loading && <SkeletonContainer />}
                    </div>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export { Navigation };
