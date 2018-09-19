import { Currency } from '../currency';

export class ContractConditionTenderParticipate {
    typeOfContract: string;
    timeForCompletion: number;
    timeForCompletionUnit: Currency;
    commencementDate: number;
    warrantyPeriod: number;
    warrantyPeriodUnit: Currency;
    tenderSecurity: number;
    tenderSecurityCurrency: Currency;
    performanceSecurity: number;
    delayDamagesForTheWorks: number;
    insurance: string;
    advancePayment: number;
    monthlyPaymentOrMilestone: Currency;
    retentionMoney: number;
    specialCondition: string;
}
