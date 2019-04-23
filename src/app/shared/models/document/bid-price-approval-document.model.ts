export class BidPriceApprovalModel {
    id: number;
    documentType: string;
    documentName: string;
    version: string;
    status: string;
    uploadedBy: {
        employeeId: number;
        employeeNo: string;
        employeeName: string;
        employeeAvatar: string;
    };
    createdDate: number;
    fileGuid: string;
    description: string;
    interviewTimes: number;
}
