export class ContactModel {
    id: number;
    salutation: string;
    firstName: string;
    lastName: string;
    dateOfBirth: number;
    customer: {
        id: number;
        name: string;
    };
    prospectSource: string;
    jobTitle: string;
    department: string;
    companyPhone: string;
    mobilePhone: string;
    homePhone: string;
    extraPhone: string;
    email: string;
    assistant: string;
    assistantPhone: string;
    assignTo: {
        id: string,
        name: string,
    };
    address: string;
    district: string;
    city: string;
    country: string;
    otherAddress: string;
    otherDistrict: string;
    otherCity: string;
    otherCountry: string;
    description: string;
    contactImageSrc: string;
    createdDate: number;
    updatedDate: number;
    image: string;
    gender: string;
    lunarBirthday: string;
}
