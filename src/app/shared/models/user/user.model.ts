export class UserModel {
    id: number;
    avatar: string;
    userName: string;
    employeeId: number;
    fullName: string;
    dateOfBirth: number;
    gender: string;
    phoneNumber: string;
    avatarUrl: string;
    email: string;
    address: string;
    role: string;
    isActive: boolean;
    userGroup: {
        id: string;
        text: string;
    };
    level: {
        id: string;
        text: string;
        code?: string;
    };
    department: {
        id: string;
        text: string;
        code?: string;
    };
    firstName: string;
    lastName: string;
    privileges: any[];
}
