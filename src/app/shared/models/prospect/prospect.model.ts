export class ProspectModel {
    id: number;
    name: string;
    revenue: number;
    firstName: string;
    phoneNumberCustomer: string;
    lastName: string;
    phoneNumberpersonal: string;
    comment: string;
    email: string;
    companyName: string;
    website: string;
    source: string;
    statusSource: string;
    fieldOfAction: string;
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
    campaign: {
        id: number;
        name: string;
    };
    objectId: number;
    objectType: string;
    gender: string;
    lunarBirthday: string;
}