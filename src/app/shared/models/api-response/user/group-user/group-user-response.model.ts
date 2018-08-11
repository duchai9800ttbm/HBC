export class GroupUserResponse {
    id: number;
    name: string;
    desc: string;
    isActive: boolean;
    privileges: [
        {
            id: string;
            text: string;
        }
    ];
}
