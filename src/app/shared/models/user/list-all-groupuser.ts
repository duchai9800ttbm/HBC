export class ListAllGroupUser {
    id: number;
    name: string;
    desc: string;
    isActive: boolean;
    privileges: {
        id: number,
        text: string,
    };
}
