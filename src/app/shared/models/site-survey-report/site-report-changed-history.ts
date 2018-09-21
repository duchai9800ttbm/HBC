import { UsefulInfo } from './useful-info.model';

export class SiteReportChangedHistory {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    items: ItemChangedHistory[];
    hasPreviousPage: true;
    hasNextPage: true;
    extraData: UsefulInfo[];
}

export class ItemChangedHistory {
    employee: {
        employeeId: number;
        employeeNo: string;
        employeeName: string;
        employeeAvatar: string;
        employeeEmail: string
    };
    changedTime: number;
    changedTimes: number;
    updateDesc: string;
    liveFormChangeds: LiveFormChangedHistory[];
}

export class LiveFormChangedHistory {
    liveFormStep: string;
    liveFormSubject: string;
    liveFormTitle: string;
    oldValue: string;
    newValue: string;
}
