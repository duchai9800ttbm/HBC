export class InterviewInvitationReport  {
    id: number;
    documentName: string;
    version: number;
    uploadedBy: {
        employeeId: number;
        employeeNo: string;
        employeeName: string;
        employeeAvatar: string;
    };
    createdDate: number;
    interviewTimes: number;
    documentDesc: string;
}
