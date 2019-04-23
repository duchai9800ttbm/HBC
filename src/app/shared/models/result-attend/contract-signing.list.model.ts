export class ContractSigningList {
    id: number;
    name: string;
    version: number;
    desc: string;
    uploadByEmployee: {
        employeeId: number;
        employeeNo: string;
        employeeName: string;
        employeeAvatar: {
            guid: string;
            thumbSizeUrl: string;
            largeSizeUrl: string;
        };
        employeeEmail: string;
    };
    uploadDate: number;
    contractDate: number;
    interviewTime: number;
    fileUrl: string;
}
