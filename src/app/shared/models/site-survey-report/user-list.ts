export class UserList {
    id: number;
    employeeId: number;
    employeeNo: string;
    employeeName: string;
    employeeAvatar: string;
    department: {
        key: number;
        value: string;
    };
    email: string;
}
