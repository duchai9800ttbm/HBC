import { CheckboxSelection } from '../checkbox-selected.model';

export class CampaignListItem extends CheckboxSelection {
    id: number;
    name: string;
    status: string;
    category: string;
    marketingObject: string;
    assignTo: string;
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
}
