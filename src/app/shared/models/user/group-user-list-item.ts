export class GroupUserList {
    id: number;
    name: string;
    desc: string;
    createdTime: number;
    isActive: boolean;
    checkbox: boolean;
    notPrivileges: any[];
    privileges: {
        id: string;
        text: string;
    }[];
    isUsing: boolean;
    userCount: number;
    canBeMofify: boolean;
    canBeDelete: boolean;
}
