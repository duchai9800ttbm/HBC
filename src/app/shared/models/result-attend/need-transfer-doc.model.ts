export class NeedTransferDoc {
    bidOpportunityId: number;
    transferDocuments: {
        documentId: number;
        documentType: string;
        departmentIds: number[];
        useDate: number
    } [];
}
