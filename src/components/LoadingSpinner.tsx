import { Backdrop, CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';
import { ConnectionStatus, getConnectionStatus, getError } from '../store/app';
import { useAppSelector } from '../store/hooks';

export const LoadingSpinner = () => {
	const callState = useAppSelector(getConnectionStatus);
	const error = useAppSelector(getError);

	if (callState === ConnectionStatus.IDLE || callState === ConnectionStatus.CONNECTED || error)
		return null;

	return (
		<Backdrop
			sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
			open={true}
		>
			<div
				style={{
					display: 'flex',
					flexFlow: 'column',
					alignItems: 'center',
					justifyContent: 'space-between',
					minHeight: 80
				}}
			>
				<CircularProgress color='inherit' />
				<Typography variant={'subtitle1'}> Connecting </Typography>
			</div>
		</Backdrop>
	);
};
