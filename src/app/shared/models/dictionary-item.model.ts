export interface DictionaryItem {
    id: number;
    text: string;
}

export interface DictionaryItemIdString {
    id: string;
    text: string;
}

export class DictionaryItemText {
    name: string;
    desc: string;
}

export interface DictionaryItemHightLight {
    id: number;
    text: string;
    hightLight?: boolean;
    count: number;
}
