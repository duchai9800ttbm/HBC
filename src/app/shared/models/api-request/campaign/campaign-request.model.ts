export class CampaignRequest{
    id: number;
    name: string;
    type: string;
    campaignStatus: string;
    startDate: number;
    completionDate: number;
    goals: string;
    expectedNumber: number;
    assignedTo: string;
    donor: string;
    campaignObject: string;
    budget: number;
    cost: number;
    expectedRevenue:number;
    actualRevenue: number;
    expectedResults: number;
    actualResults: number;
    description	: string;
    employee: {
        id: number;
    };
    branch: {
        id: number;
    };
}