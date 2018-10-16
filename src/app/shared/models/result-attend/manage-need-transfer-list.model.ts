export class ManageNeedTranferList {
    id: number;
    document: {
        type: string;
        id: number;
        name: string;
        interviewTime: number;
        isLiveForm: string;
    };
    department: {
        key: string;
        value: string;
        displayText: string;
    };
    receivedEmployee: {
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
    receiveStatus: {
        key: string;
        value: string;
        displayText: string;
    };
}
