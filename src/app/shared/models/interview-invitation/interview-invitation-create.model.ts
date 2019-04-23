import { CustomerModel } from './customer.model';
export class InterviewInvitation {
    id: number;
    customer: CustomerModel;
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
    // attachedFiles?: string;
}
