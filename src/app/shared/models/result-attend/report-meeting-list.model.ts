export class ReportMeetingList {
    id: number;
    documentName: string;
    version: string;
    uploadedBy: {
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
    createdDate: number;
    interviewTimes: number;
    meetingTime: number;
    fileUrl: string;
    description: string;
}
