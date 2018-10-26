export class CustomerModel {
    id: number;
    employeeId: number;
    employeeNo: string;
    employeeName: string;
    employeeAvatar: string;
    department: {
        key: number | string;
        value: string
    };
    email: string;
}
