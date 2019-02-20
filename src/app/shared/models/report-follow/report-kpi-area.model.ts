export class ReportKpiArea {
    kpiLocationDetails: {
            location: {
                id: number;
                locationName: string;
                locationNo: string;
                locationDesc: string
            };
            kpiTarget: number;
            winningOfBidAmount: number;
            achievedPercent: number
        }[];
    kpiTargetTotalAmount: number;
    winningOfBidTotalAmount: number;
    achievedPercent: number;
}
