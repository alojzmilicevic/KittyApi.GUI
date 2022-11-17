import { Backdrop, CircularProgress, styled, Typography } from '@mui/material';
import { ConnectionStatus, getConnectionStatus, getError } from '../store/app';
import { useAppSelector } from '../store/hooks';

const StyledContainer = styled('div')({
	display: 'flex',
	flexFlow: 'column',
	alignItems: 'center',
	justifyContent: 'space-between',
	minHeight: 80,
});

const StyledBackdrop = styled(Backdrop)(({ theme }) => ({
	zIndex: theme.zIndex.drawer + 1,
}));

export const LoadingSpinner = () => {
	const callState = useAppSelector(getConnectionStatus);
	const error = useAppSelector(getError);


	if (callState === ConnectionStatus.IDLE || callState === ConnectionStatus.CONNECTED || error)
		return null;

	return (
		<StyledBackdrop open>
			<StyledContainer>
				<CircularProgress color='secondary' />
				<Typography>
					Connecting
				</Typography>
			</StyledContainer>
		</StyledBackdrop>
	);
};
