export class HadTransferList {
    bidOpportunityStage: {
        key: string;
        value: string;
        displayText: string;
    };
    transferDocument: {
        documentType: {
            key: string;
            value: string;
            displayText: string;
        };
        documents: {
            departments: {
                key: string;
                value: string;
                displayText: string;
            } [];
            useDays: number;
            type: string;
            id: string;
            name: string;
            interviewTime: number;
            isLiveForm: boolean
        }[];
        childDocuments: {
            documentType: {
                key: string;
                value: string;
                displayText: string;
            };
            documents: {
                departments: {
                    key: string;
                    value: string;
                    displayText: string;
                } [];
                useDays: number;
                type: string;
                id: number;
                name: string;
                interviewTime: number;
                isLiveForm: boolean;
            }[];
        }[];
    } [];
}
