import { useAppSelector } from '../store/hooks';
import { ConnectionStatus, getConnectionStatus } from '../store/app';
import { Backdrop, CircularProgress } from '@mui/material';
import React from 'react';
import Typography from '@mui/material/Typography';

export const LoadingSpinner = () => {
    const callState = useAppSelector(getConnectionStatus);

    if (callState === ConnectionStatus.IDLE || callState === ConnectionStatus.CONNECTED)
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
