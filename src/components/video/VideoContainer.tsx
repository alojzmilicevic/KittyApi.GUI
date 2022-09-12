type VideoContainerProps = {
    parentWidth: number,
    parentHeight: number,
}

export const AspectRatio = 16 / 10;

export const VideoContainer = ({ parentWidth, parentHeight }: VideoContainerProps) => <video
    style={{
        width: parentWidth,
        height: 'auto',
        maxWidth: ((1 - AspectRatio) + 2) * parentHeight - 2
    }}
    id={'localvideo'}
    autoPlay
/>;
