import {
    Avatar,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { resourcesUrl } from '../../authentication/service/authentication-service';
import { Stream } from './Streams';

interface Props {
    stream: Stream;
}

const StreamCard = ({ stream }: Props) => {
    const { streamTitle, streamerName, thumbnail, streamerUsername } = stream;
    const navigate = useNavigate();
    return (
        <Card>
            <CardActionArea onClick={() => { navigate(`${streamerUsername}`) }}>
                <CardMedia
                    component="img"
                    height="140"
                    image={`${resourcesUrl}${thumbnail.thumbnailPath}`}
                    alt={thumbnail.thumbnailName}
                />
                <CardContent sx={{ display: 'flex' }}>
                    <Avatar>{streamerName[0]}</Avatar>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{ ml: 2 }} variant="body2">
                            {streamTitle}
                        </Typography>
                        <Typography sx={{ ml: 2 }} variant="caption">
                            {streamerName}
                        </Typography>
                    </div>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export { StreamCard };
