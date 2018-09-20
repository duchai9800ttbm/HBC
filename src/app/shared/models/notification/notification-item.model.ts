// export interface NotificationItem {
//     id: number;
//     moduleName: string;
//     moduleItemId: number;
//     moduleItemName: string;
//     startDate: number;
//     endDate: number;
//     unread: boolean;
// }
export class NotificationItem {
    id: number;
    notificationName: string;
    notificationMessage: string;
    sendEmployee: {
        employeeId: number;
        employeeNo: string;
        employeeName: string;
        employeeAvatar: string;
        employeeEmail: string;
    };
    notificationState: {
        key: string;
        value: string;
        displayText: string;
    };
    bidOpportunityId: number;
    liveFormType: {
        key: string;
        value: string;
        displayText: string;
    };
    sendDate: number;
}
