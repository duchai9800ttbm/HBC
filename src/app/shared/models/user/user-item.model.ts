export class UserItemModel {
    id: number;
    employeeId: number;
    employeeNo: string;
    employeeName: string;
    employeeAvatar: string;
    department: {
        value: string
    };
    email: string;
}
