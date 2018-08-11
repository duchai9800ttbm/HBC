import { CheckboxSelection } from '../checkbox-selected.model';

export class ContactListItem extends CheckboxSelection {
    id: string;
    salutation: string;
    firstName: string;
    lastName: string;
    companyPhone: string;
    mobilePhone: string;
    email: string;
    companyName: string;
    source: string;
    jobTitle: string;
    assignTo: string;
}

