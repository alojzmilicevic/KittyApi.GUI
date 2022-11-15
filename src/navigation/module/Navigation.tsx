import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VideocamIcon from '@mui/icons-material/Videocam';
import { AppBar, Button, IconButton, Skeleton, styled, Toolbar, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import { grey } from '@mui/material/colors';
import Grid from '@mui/material/Unstable_Grid2';
import { NavLink } from 'react-router-dom';
import { AppTopLeftIcon } from '../../assets/AppTopLeftIcon';
import { UserModel } from '../../user/UserModel';
import { NavMenu } from '../components/NavMenu';

interface NavigationProps {
    user: UserModel | undefined;
    logout: () => void;
    loading: boolean;
}

export const NavbarOffset = styled('div')(({ theme }) => theme.mixins.toolbar);
const FlexCenter = styled('div')({ display: 'flex', alignItems: 'center' });
const StyledToolbar = styled(Toolbar)({ justifyContent: 'space-between', display: 'flex' });
const StyledAppBar = styled(AppBar)(({ theme }) => ({
    position: 'fixed',
    zIndex: theme.zIndex.drawer + 1,
}));

const SkeletonContainer = () => <Grid container spacing={4}>
    <Grid>
        <Skeleton animation='wave' variant='circular' width={40} height={40} />
    </Grid>
    <Grid>
        <Skeleton animation='wave' variant='circular' width={40} height={40} />
    </Grid>
</Grid>;

const Navigation = ({ user, logout, loading }: NavigationProps) => (
    <Box>
        <StyledAppBar>
            <StyledToolbar>
                <FlexCenter>
                    <Button component={NavLink} to={'/'} disableRipple size={'small'} color='secondary' startIcon={<AppTopLeftIcon />}>
                        KittyIO
                    </Button>
                    <Button component={NavLink} to={'/streams'} color="secondary">
                        Streams
                    </Button>
                </FlexCenter>
                <FlexCenter>
                    {user &&
                        <Tooltip title={'Stream'}>
                            <IconButton sx={{ color: grey[200] }} component={NavLink} to={'/streamer'}>
                                <VideocamIcon fontSize={'large'} />
                            </IconButton>
                        </Tooltip>}

                    {!user && !loading &&
                        <Button
                            size={'large'}
                            color='inherit'
                            component={NavLink}
                            to={'/login'}
                            variant={'outlined'}
                            startIcon={<AccountCircleIcon sx={{ width: 24, height: 24 }} />}
                        >
                            Login
                        </Button>}
                    {user && <NavMenu logout={logout} />}
                    {!user && loading && <SkeletonContainer />}
                </FlexCenter>
            </StyledToolbar>
        </StyledAppBar>
        <NavbarOffset />
    </Box>
);

export { Navigation };

