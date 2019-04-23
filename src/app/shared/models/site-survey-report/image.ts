export class Image {
    description: string;
    images: ImageItem[];
}

export class ImageItem {
    id: string;
    thumbSizeUrl: string;
    largeSizeUrl: string;
}
