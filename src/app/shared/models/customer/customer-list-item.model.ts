import { CheckboxSelection } from '../checkbox-selected.model';

export class CustomerListItem extends CheckboxSelection {
    id: string;
    customerName: string;
    website: string;
    fax: string;
    taxNo: string;
    customerPhone: string;
    email: string;
    business: string;
    group: string;
    rating: number;
    revenue: string;
    assignTo: string;
}
