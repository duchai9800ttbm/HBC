export class UserModel {
    id: number;
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
    };
    department: {
        id: string;
        text: string;
    };
    firstName: string;
    lastName: string;
    privileges: any[];
}
