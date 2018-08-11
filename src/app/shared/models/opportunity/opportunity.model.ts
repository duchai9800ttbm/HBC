
export class OpportunityModel {
    id: number;
    name: string;
    opportunityDateStop: number;
    customer: {
        id: string,
        name: string,
    };
    contact: {
        id: string,
        salutation: string,
        firstName: string,
        lastName: string,
    };
    contacts: {};
    category: string;
    prospectSource: string;
    amount: number;
    phase: string;
    probability: number;
    campaign: {
        id: number,
        name: string;
    };
    assignTo: {
        id: string,
        name: string,
    };
    description: string;
    expectedValue: number;
    createdDate: number;
    updatedDate: number;
}
