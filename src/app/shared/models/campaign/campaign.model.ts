export class CampaignModel {
    id: number;
    name: string;
    status: string;
    category: string;
    marketingObject: string;
    assignTo: {
        id: string;
        name: string;
    };
    campaignDateStart: number;
    campaignDateStop: number;
    donors: string;
    target: string;
    numberOfParticipants: number;
    budget: number;
    actualCost: number;
    expectedRevenue: number;
    actualRevenue: number;
    expectedInvestmentEfficiency: number;
    actualInvestmentEfficiency: number;
    description: string;
    createdDate: number;
    updatedDate: number;
}
