export class ReportWinRateConstractors {
    reportKPIBidderRoleDetails: {
        bidderRole: {
            key: string;
            value: string;
            displayText: string;
        },
        winningOfBidPer: number;
        amount: number;
    }[];
    winningOfBidPer: number;
    totalAmount: number;
}
