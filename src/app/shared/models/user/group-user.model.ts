export class GroupUserModel {
    id: number;
    userName: string;
    email: string;
    lastName: string;
    firstName: string;
    departmentId: string | number = 0;
    password: string;
    rePassword: string;
    levelId: string | number = 0;
    userGroupId: string | number = 0;
    isActive: boolean = true;
    phoneNumber: number;
    address: string;
}
