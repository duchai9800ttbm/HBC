export class BidDocumentGroupModel {
    id?: number;
    documentType: string;
    items: {
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
        isApproved: boolean;
        fileGuid: string;
        desc: string;
        url?: string;
    }[];
}
