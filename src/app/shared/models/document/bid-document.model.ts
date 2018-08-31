export class BidDocumentModel {
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
    receivedDate: number;
    fileGuid: string;
    desc: string;
    url?: string;
}
