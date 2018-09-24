export class InterviewInvitationReportList {
    id: number;
    // documentType: {
    //     key: string;
    //     value: string;
    //     displayText: string;
    // };
    documentName: string;
    version: string;
    // status: string;
    uploadedBy: {
        employeeId: number;
        employeeNo: string;
        employeeName: string;
        employeeAvatar: string;
        employeeEmail: string;
    };
    createdDate: number;
    // fileGuid: string;
    // receivedDate: number;
    // url: string;
    // description: string;
    interviewTimes: number;
    desc: string;
}
