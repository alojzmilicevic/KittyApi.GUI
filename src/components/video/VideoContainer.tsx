type VideoContainerProps = {
    parentWidth?: number,
    parentHeight?: number,
}

export const AspectRatio = 16 / 10;

export const VideoContainer = ({ parentWidth, parentHeight }: VideoContainerProps) => {
    const maxWidth = parentHeight ? ((1 - AspectRatio) + 2) * parentHeight - 2 : '100%';
    return <video
        style={{
            width: parentWidth || '100%',
            height: 'auto',
            maxWidth,
        }}
        id={'localvideo'}
        autoPlay />;
};
