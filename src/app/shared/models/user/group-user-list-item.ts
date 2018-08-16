export class GroupUserList {
    id: number;
    name: string;
    desc: string;
    isActive: boolean;
    checkbox: boolean;
    notPrivileges: any[];
    privileges: {
        id: string;
        text: string;
    }[];
    isUsing: boolean;
}
