import { VideoCameraFront } from "@mui/icons-material";
import { Box, Button, MenuItem, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { resourcesUrl } from "../../authentication/service/authentication-service";
import { getImagePath } from "../../common/util/util";
import { LabeledSelect } from "../../components/LabeledSelect";
import { StyledTextField } from "../../components/StyledTextField";
import { getUser } from "../../store/app";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Thumbnail } from "../../viewer-app/interface";
import { StartStreamInput } from "../interface";
import StreamerService from "../service/streamerService";
import { startStream } from "../store/streamerMiddleware";

const StartStreamButton = () => <Button
    type={'submit'}
    size='small'
    variant={'contained'}
    color='secondary'
    sx={{ mt: 2, minWidth: 200 }}
    fullWidth
    endIcon={<VideoCameraFront />}
>
    Start Stream
</Button>

const SmallImage = styled('img')({
    width: 100,
    height: 100,
    borderRadius: 12,
    padding: 4,
});

const StyledImageDiv = styled('div')({
    display: 'flex',
    alignItems: 'flex-end',
});

interface ThumbnailControlProps {
    control: any;
    thumbnails: Thumbnail[];
    getValues: any;
}

const ThumbnailControl = ({ control, thumbnails, getValues }: ThumbnailControlProps) => {
    if (thumbnails.length === 0) {
        return null;
    }

    const currentThumbnail = getValues('thumbnail');
    const path = thumbnails[currentThumbnail].thumbnailPath;
    const url = `${resourcesUrl}${getImagePath(path, 'xl')}`;

    return <>
        <Controller
            name='thumbnail'
            control={control}
            render={({ field: { onChange, value } }) => <StyledImageDiv>
                <LabeledSelect label={"Thumbnail"} onChange={onChange} value={value}>
                    {thumbnails.map((thumbnail: Thumbnail, index: number) => <MenuItem key={index} value={index}>{thumbnail.thumbnailName}</MenuItem>)}
                </LabeledSelect>
                <SmallImage src={url} alt='thumbnailAlt' />
            </StyledImageDiv>
            }
        />
    </>
}

const TitleControl = ({ control, errors }: { control: any, errors: any }) => <Controller
    name='title'
    control={control}
    rules={{ required: 'This field is required' }}
    defaultValue=''
    render={({ field }) => <StyledTextField
        label='Stream Title'
        error={!!errors.title}
        helperText={errors.title?.message}
        {...field} />}
/>

function useCreateStreamForm() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(getUser);
    const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
    const { control, handleSubmit, formState: { errors }, getValues, watch } = useForm<StartStreamInput>({
        mode: 'onChange', defaultValues: { title: user?.firstName + " " + user?.lastName + " stream", thumbnail: 0 }
    });

    // Need to watch for changes on this otherwise image wont refresh
    watch('thumbnail');

    useEffect(() => {
        const fetchThumbnails = async () => {
            const thumbnails = await StreamerService.getThumbnailData();
            setThumbnails(thumbnails);
        }

        fetchThumbnails();
    }, []);

    const onSubmitForm = (formInput: StartStreamInput) => {
        const thumbnail = thumbnails[formInput.thumbnail]; // Get the thumbnail id
        dispatch(startStream({ title: formInput.title, thumbnail: thumbnail.thumbnailId }));
    }

    return {
        control,
        onSubmit: handleSubmit(onSubmitForm),
        thumbnails,
        getValues,
        errors
    }
}

const CreateStreamForm = () => {
    const { control, onSubmit, thumbnails, getValues, errors } = useCreateStreamForm();

    return <Box component='form' onSubmit={onSubmit} sx={{ width: '100%' }}>
        <TitleControl control={control} errors={errors} />
        <ThumbnailControl
            control={control}
            thumbnails={thumbnails}
            getValues={getValues}
        />
        <StartStreamButton />
    </Box>
}

export { CreateStreamForm };

