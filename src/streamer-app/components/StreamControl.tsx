import { Stop } from "@mui/icons-material";
import { Button } from "@mui/material";
import { getStreamInfo } from "../../store/app";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { endStream } from "../store/streamerMiddleware";
import { CreateStreamForm } from "./CreateStreamForm";

const StreamControl = () => {
    const dispatch = useAppDispatch();
    const streamInfo = useAppSelector(getStreamInfo);
    
    return <>
        {!streamInfo && <CreateStreamForm />}
        {streamInfo && <Button
            size={'small'}
            variant='contained'
            color='secondary'
            sx={{ mt: 2 }}
            fullWidth
            endIcon={<Stop />}
            onClick={() => dispatch(endStream())}>
            Stop Stream
        </Button>
        }
    </>
}

export { StreamControl };