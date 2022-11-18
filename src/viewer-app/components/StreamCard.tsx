import {
    Avatar,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    styled,
    Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { resourcesUrl } from '../../authentication/service/authentication-service';
import { getImagePath } from '../../common/util/util';
import { Stream } from '../interface';

interface Props {
    stream: Stream;
}

const StyledTextContent = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(2)
}));

const StyledCardContent = styled(CardContent)({ display: 'flex' });

const StreamCard = ({ stream }: Props) => {
    const { streamTitle, streamerName, thumbnail, streamerUsername } = stream;
    const navigate = useNavigate();

    return (
        <Card>
            <CardActionArea onClick={() => { navigate(`${streamerUsername}`) }}>
                <CardMedia
                    component="img"
                    height="140"
                    image={`${resourcesUrl}${getImagePath(thumbnail.thumbnailPath)}`}
                    alt={thumbnail.thumbnailName}
                />
                <StyledCardContent sx={{ display: 'flex' }}>
                    <Avatar>{streamerName[0]}</Avatar>
                    <StyledTextContent>
                        <Typography variant="body2">
                            {streamTitle}
                        </Typography>
                        <Typography variant="caption">
                            {streamerName}
                        </Typography>
                    </StyledTextContent>
                </StyledCardContent>
            </CardActionArea>
        </Card>
    );
};

export { StreamCard };

