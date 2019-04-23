import { ImageItem } from './image';

export class UsefulInfo {
    title: string;
    content: ContentItem[];
}

export class ContentItem {
    name: string;
    detail: string;
    imageUrls: ImageItem[];
}
