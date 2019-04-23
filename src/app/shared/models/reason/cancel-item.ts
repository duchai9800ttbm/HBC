export class CancelItem {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    items : {
        id: number;
        reasonName: string;
        reasonNo: string;
        reasonDesc: string;
    };
    hasPreviousPage: boolean;
    hasNextPage:boolean;
    extraData: {}
}
