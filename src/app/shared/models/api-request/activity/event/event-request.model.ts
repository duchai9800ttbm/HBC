export class EventRequest {
    id: number;
    name: string;
    startDate: number;
    endDate: number;
    activityStatus: string;
    address: string;
    activityObjectTypeName: string;
    activityObjectType: string;
    activityObjectTypeId: number;
    assignedTo: string;
    description: string;
    eventType: string;
    activityType: string;
    employee: {
        id: number;
    };
    branch: {
        id: number;
    };
}