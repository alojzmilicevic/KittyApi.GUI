export function getImagePath(imagePath: string, size: 'sm' | 'xl' = 'sm') {
    const splitPath = imagePath.split('.');
    const extension = splitPath.pop();
    const path = splitPath.join('.');
    return `${path}-${size}.${extension}`;
}