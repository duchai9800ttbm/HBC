export class ApprovedDossiersList {
    typeName: string;
    isLiveForm: boolean;
    document: {
        type: string;
        id: number;
        name: string;
        interviewTime: number;
        isLiveForm: boolean;
        filerUrl: string;
    }[];
    childs: {
        typeName: string;
        document: {
            type: string;
            id: number;
            name: string;
            interviewTime: number;
            isLiveForm: boolean;
            filerUrl: string;
        }
    }[];
}
