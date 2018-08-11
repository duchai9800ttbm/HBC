export class CustomerModel {
    id: number;
    name: string;
    emailOfficial: string;
    website: string;
    emailExtra: string;
    fax: string;
    career: string;
    phoneNumberOfficial: string;
    group: string;
    stockCode: string;
    rating: number;
    taxCode: string;
    type: string;
    phoneNumberExtra: string;
    revenue: number;
    assignTo: {
        id: string;
        name: string;
    };
    address: string;
    city: string;
    country: string;
    district: string;
    description: string;
    createdDate: number;
    updatedDate: number;
    companyEstablishmentDay: number;
    dob: number;
    customerType: string;
    contact: {};
    number?: string;
    creditLimit?: number; // hạn mức tín dụng
    owing?: number; // công nợ
    customerGroup?: string;
    check?: boolean;
    desc?: string;
    lunarBirthday: string;
    gender: string;
}
