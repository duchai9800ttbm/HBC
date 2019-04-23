export class ReportKpiChair {
    kpiGroupChairs:
        {
            kpiGroup: {
                id: number;
                name: string;
                desc: string;
                status: {
                    key: string;
                    value: string;
                    displayText: string
                }
            };
            chairDetail:
            {
                employee: {
                    id: number;
                    employeeId: number;
                    employeeNo: string;
                    employeeName: string;
                    employeeAddress: string;
                    employeeDob: number;
                    employeeTel: string;
                    employeeTel1: string;
                    departmentName: string;
                    levelName: string;
                    employeeAvatar: {
                        guid: string;
                        thumbSizeUrl: string;
                        largeSizeUrl: string
                    };
                    departmentRoomName: string;
                    branchName: string;
                    employeeBirthPlace: string;
                    employeeIDNumber: string;
                    employeeGender: string;
                    employeeTaxNumber: string;
                    employeeBankAccount: string
                };
                kpiTargetAmount: number;
                winningOfBidTotalAmount: number;
                achievedPercent: number
            }[];
            kpiTargetAmount: number;
            winningOfBidValueAmount: number
        }[];
    kpiTargetAmount: number;
    winningOfBidTotalAmount: number;
    achievedPercent: number;
    winningBidOfDayTargetAmount: number;
    dayCount: number;
    winningOfBidTargetAmount: number;
    winningBidOfDayCompareTargetAmount: number;
}
