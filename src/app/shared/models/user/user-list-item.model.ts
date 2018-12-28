export class ListUserItem {
    id: number;
    userName: string;
    email: string;
    department: {
        key: string;
        value: string;
    };
    level: {
        key: string;
        value: string;
    };
    firstName: string;
    lastName: string;
    userGroup: {
        id: number;
        name: string;
        desc: string;
        isActive: true;
        privilegeUserGroups: [
            {
                key: string;
                value: string;
            }
        ]
    };
    isActive: true;
    phoneNumber: number;
    address: string;
    systemType: string;
}
