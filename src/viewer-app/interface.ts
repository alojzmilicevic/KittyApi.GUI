export interface Thumbnail {
    thumbnailId: number;
    thumbnailName: string;
    thumbnailPath: string;
}

export interface Stream {
    streamId: string;
    streamTitle: string;
    streamerName: string;
    thumbnail: Thumbnail;
    streamerUsername: string;
}