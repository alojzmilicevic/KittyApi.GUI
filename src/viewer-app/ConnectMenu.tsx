import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { connectToStream, leaveStream } from "./store/store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { CallStatus, getCallStatus } from "../store/app";

export const ConnectMenu = () => {
    const dispatch = useAppDispatch();
    const callStatus = useAppSelector(getCallStatus);

    return <>
        {callStatus === CallStatus.IDLE &&
            <>
              <Typography variant={'h4'}>
                Ready to join?
              </Typography>
              <Typography sx={{
                  marginTop: 2
              }} variant={'body1'}>There is no one else here</Typography>
            </>
        }
        <div style={{ marginTop: 8, display: "flex", alignItems: 'center', justifyContent: 'center' }}>
            {callStatus === CallStatus.IDLE &&
                <Button
                    sx={{ textTransform: 'none' }}
                    variant={"contained"}
                    onClick={() => dispatch(connectToStream())}
                >
                  Join Stream
                </Button>
            }
            {callStatus === CallStatus.CONNECTED &&
                <Button
                    sx={{ textTransform: 'none' }}
                    variant={'contained'}
                    onClick={() => dispatch(leaveStream())}
                >
                  Leave Stream
                </Button>
            }
        </div>
    </>
}
