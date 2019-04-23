export class ReportPotentialProjects {
    id: number;
    opportunityName: string;
    projectName: string;
    chairEmployee: {
        id: number;
        employeeId: number;
        employeeNo: string;
        employeeName: string;
        employeeAddress: string;
        employeeDob: number;
        employeeTel: string;
        employeeTel1: string;
        departmentName: string;
        levelName: string;
        employeeAvatar: {
            guid: string;
            thumbSizeUrl: string;
            largeSizeUrl: string
        };
        departmentRoomName: string;
        branchName: string;
        employeeBirthPlace: string;
        employeeIDNumber: string;
        employeeGender: string;
        employeeTaxNumber: string;
        employeeBankAccount: string
    };
    totalCostOfSubmission: number;
}
