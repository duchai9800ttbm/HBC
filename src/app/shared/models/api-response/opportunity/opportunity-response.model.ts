export class OpportunityResponse{
    id: number;
    name: string;
    customer:{
        company: string;
    };
    customerContact:{
        name: string;
    };
    classify: string;
    potentialSources: string;
    amount: number;
    step: string;
    probability: number;
    strategy: string;
    assignedTo: string;
}