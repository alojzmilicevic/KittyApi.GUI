import { VideoCameraFront } from "@mui/icons-material"
import { Box, Button, FormHelperText, Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form"
import { resourcesUrl } from "../authentication/authentication";
import { CssTextField } from "../authentication/login/LoginForm"
import { useAppDispatch } from "../store/hooks";
import { Thumbnail } from "../viewer-app/streams/Streams";
import { StartStreamInput } from "./App";
import { startStream } from "./store/streamerMiddleware";
import { getThumbnailData } from "./streamer.api";

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

const StartStreamForm = () => {
    const dispatch = useAppDispatch();
    const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
    const { control, handleSubmit, formState: { errors }, getValues } = useForm<StartStreamInput>({
        mode: 'onChange', defaultValues: { title: '', thumbnail: -1 }
    });

    useEffect(() => {
        getThumbnailData().then((data: Thumbnail[]) => setThumbnails([{ thumbnailName: 'None', thumbnailPath: 'None', thumbnailId: -1 }, ...data]));
    }, [dispatch]);


    const onSubmit = (formInput: StartStreamInput) => {
        dispatch(startStream(formInput));
    }

    return <Grid xs={12} container component='form' onSubmit={handleSubmit((onSubmit))} sx={{ mt: 1 }} display={'flex'} flexDirection={'column'}>
        <Typography variant='h5'>Start Stream</Typography>

        <Controller
            name='title'
            control={control}
            defaultValue=''
            rules={{ required: 'This field is required' }}
            render={({ field }) => <CssTextField
                margin='normal'
                fullWidth
                id='title'
                label='Stream Title'
                autoComplete='title'
                autoFocus
                error={!!errors.title}
                helperText={errors.title?.message}
                {...field} />}
        />

        <InputLabel id="thumbnail">Thumbnail</InputLabel>
        <Controller
            name='thumbnail'
            control={control}
            rules={{
                validate: (value) => {
                    setThumbnails([...thumbnails]);
                    return value !== -1 || 'Please select a thumbnail';
                }
            }}
            render={({ field }) => <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <Select
                    labelId='thumbnail'
                    id='thumbnail'
                    label='thumbnail'
                    aria-label='thumbnail'
                    variant='standard'
                    fullWidth
                    {...field}

                    error={!!errors.thumbnail}
                >
                    {thumbnails.map((thumbnail: Thumbnail) => <MenuItem value={thumbnail.thumbnailId}>{thumbnail.thumbnailName}</MenuItem>)}
                </Select>
                {thumbnails.length > 0 && getValues('thumbnail') !== -1 && <img style={{ width: 100, height: 80 }} src={`${resourcesUrl}${thumbnails[getValues('thumbnail')].thumbnailPath}`} alt='thumbnail' />}

            </div>
            }
        />
        {errors.thumbnail && <FormHelperText error>{errors.thumbnail.message}</FormHelperText>}

        <StartStreamButton />
    </Grid>


}

export { StartStreamForm };