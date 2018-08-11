export class BidDocumentReviewModel {
    id: number;
    bidReviewDocumentName: string;
    bidReviewDocumentVersion: string;
    bidReviewDocumentStatus: string;
    bidReviewDocumentUploadedBy: {
        employeeId: number;
        employeeNo: string;
        employeeName: string;
        employeeAvatar: string;
    };
    bidReviewDocumentUploadDate: string;
}
