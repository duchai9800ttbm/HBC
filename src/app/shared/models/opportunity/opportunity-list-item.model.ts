import { CheckboxSelection } from "../checkbox-selected.model";

export class OpportunityListItem extends CheckboxSelection  {
    id: number;
    opportunityName: string;
    customerName: string;
    contact: {
        salutation: string,
        firstName: string,
        lastName: string,
    };
    category: string;
    amount: number;
    phase: string;
    probability: number;
    assignTo: string;
    expectedValue: number;
}
