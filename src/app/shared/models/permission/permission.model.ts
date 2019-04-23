export class PermissionModel {
    bidOpportunityStage: string;
    userPermissionDetails: {
        permissionGroup: {
            key: string | number;
            value: string;
            displayText: string
        };
        permissions: {
            key: string | number;
            value: string;
            displayText: string
            tenderDocumentTypeId?: number;
        }[]
    }[];
}
