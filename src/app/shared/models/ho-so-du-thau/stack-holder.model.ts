export class StakeHolder {
    id: number;
    groupName: string;
    groupDesc: string;
    customers: CustomerStakeHolder[];

}

export class CustomerStakeHolder {
    customerId: number;
    customerName: string;
    customerNo: string;
    customerDesc: string;
    contacts: ContactStakeHolder[];
    note?: string;
}

export class ContactStakeHolder {
    id: number;
    name: string;
}
