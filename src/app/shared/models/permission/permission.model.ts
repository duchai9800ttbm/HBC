export class PermissionModel  {
    bidOpportunityStage: string;
    userPermissionDetails: {
        permissionGroup: {
            key: string;
            value: string;
            displayText: string
        };
        permissions: {
            key: string;
            value: string;
            displayText: string
        }[]
    }[];
}
