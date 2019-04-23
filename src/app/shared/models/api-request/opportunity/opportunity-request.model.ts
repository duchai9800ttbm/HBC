export class OpportunityRequest{
    id: number;
    name: string;
    customer:{
        id: number;
    };
    customerContact:{
        id: number;
    };
    potentialSources: string;
    amount: number;
    classify: string;
    completionDate: number;
    step: string;
    probability: number;
    strategy: string;
    expectedValue: number;
    assignedTo: string;
    description: string;
    branch: {
        id: number;
    }
}