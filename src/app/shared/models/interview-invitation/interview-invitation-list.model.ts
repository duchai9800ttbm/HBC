export class InterviewInvitationList {
    id: number;
    customer: {
        id: number;
        customerId: number;
        customerName: string;
        customerNo: string;
        customerDesc: string;
        customerClassify: string;
        customerNewOldType: string;
        customerPhone: string;
        customerAddress: string;
    };
    approvedDate: number;
    interviewDate: number;
    place: string;
    content: string;
    interviewTimes: number;
    status: {
        key: string;
        value: string;
        displayText: string;
    };
    remainningDay: number;
}
