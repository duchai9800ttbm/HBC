export class CacBenLienQuan {
    groupId: number;
    customers: CustomerCacBenLienQuan[];
}

class CustomerCacBenLienQuan {
    id: number;
    note: string;
    customerContacts: CustomerContactsCacBenLienQuan[];
}

class CustomerContactsCacBenLienQuan {
    id: number;
    name: string;
}
