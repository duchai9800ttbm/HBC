export class NeedTranferDocList {
    bidOpportunityStage: {
        key: string;
        value: string;
        displayText: string;
    };
    needTransferDocument: {
        documentType: {
            key: string;
            value: string;
            displayText: string;
        };
        document: {
            type: string;
            id: number;
            name: string;
            interviewTime: number;
            isLiveForm: boolean;
        };
        childDocuments: {
            documentType: {
                key: string;
                value: string;
                displayText: string;
            }
            document: {
                type: string;
                id: number;
                name: string;
                interviewTime: number;
                isLiveForm: boolean;
            }
        } [];
    } [];
}
