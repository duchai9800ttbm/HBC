export class TransferredDoc {
    bidDocumentState: {
        key: string;
        value: string;
        displayText: string;
    };
    bidTransferDocDetails: {
        id: number;
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
        sendDate: number;
        useTo: number;
        status: {
            key: string;
            value: string;
            displayText: string;
        };
        sendEmployee: {
            employeeId: number;
            employeeNo: string;
            employeeName: string;
            employeeAvatar: {
                guid: string;
                thumbSizeUrl: string;
                largeSizeUrl
            };
            employeeEmail: string;
        };
        isFirstTransfer: boolean;
    } [];
}
