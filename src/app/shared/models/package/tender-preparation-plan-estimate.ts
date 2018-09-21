import { TenderDistribution } from './tender-distribution';

export class TenderPreparationPlanEstimate {
    desc: string;
    massWorkDesc: string;
    massWorkFollowTenderDocument: TenderDistribution;
    massWorkBPTC: TenderDistribution;
    massWorkClarifying: TenderDistribution;
    priceWorkDesc: string;
    priceWorkFilterDocument: TenderDistribution;
    priceWorkRequirement: TenderDistribution;
    priceWorkConstructionMethod: TenderDistribution;
    mepDesc: string;
    mepDescFilterDocument: TenderDistribution;
    generalCostDesc: string;
    generalCostCalculation: TenderDistribution;
    estimateCompletionDesc: string;
    estimateCompletionChooseSubTenderPrice: TenderDistribution;
    estimateCompletionImport: TenderDistribution;
}
