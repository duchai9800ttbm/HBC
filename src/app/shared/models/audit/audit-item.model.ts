export interface AuditItem {
    user: string;
 //   avatar: string;
    id: number;
    date: number;
    actionCode: number;
    actionName: string;
    valueChanges: {
        field: string;
        beforeValue: string;
        afterValue: string;
    };
    moduleName: string;
    moduleItemId: string | number;
    moduleItemName: string | number;
}
