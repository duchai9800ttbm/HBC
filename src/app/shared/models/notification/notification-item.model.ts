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
    notificationType: string;
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
        id: string;
        text: string;
        displayText: string;
    };
    bidOpportunityId: number;
    bidOpportunityName: string;
    liveFormType: {
        key: string;
        value: string;
        displayText: string;
    };
    sendDate: number;
    data: number;
}
