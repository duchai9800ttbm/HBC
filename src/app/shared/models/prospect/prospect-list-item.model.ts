import { CheckboxSelection } from '../checkbox-selected.model';

export class ProspectListItem extends CheckboxSelection {
    id: string;
    salutation: string;
    firstName: string;
    lastName: string;
    evaluation: string;
    companyPhone: string;
    mobilePhone: string;
    email: string;
    companyName: string;
    source: string;
    business: string;
    assignTo: string;
}
