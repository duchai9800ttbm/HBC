export class HistoryLiveForm {
    employee: {
        employeeId: number;
        employeeNo: string;
        employeeName: string;
        employeeAvatar: string;
        employeeEmail: string;
    };
    changedTime: number;
    changedTimes: number;
    updateDesc: string;
    liveFormChangeds: {
        liveFormStep: string;
        liveFormSubject: string;
        liveFormTitle: string;
        oldValue: string;
        newValue: string;
    }[];
}
