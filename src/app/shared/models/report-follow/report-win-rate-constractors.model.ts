export class ReportWinRateConstractors {
    reportKPIBidderRoleDetails: {
        bidderRole: {
            key: string;
            value: string;
            displayText: string;
        },
        winningOfBidPer: number;
        amount: number;
        note: string;
    }[];
    winningOfBidPer: number;
    totalAmount: number;
}
