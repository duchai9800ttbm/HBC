export class TaskRequest {
    id: number;
    name: string;
    startDate: number;
    endDate: number;
    activityStatus: string;
    address: string;
    activityObjectTypeName: string;
    activityObjectTypeId: number;
    assignedTo: string;
    description: string;
    activityType: string;
    activityObjectType: string;
    employee: {
        id: number;
    };
    branch: {
        id: number;
    };
}