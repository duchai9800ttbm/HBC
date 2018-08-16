export class PackageInfoModel {
    id: number;
    classify: string;
    amount: number;
    opportunityName: string;
    projectName: string;
    projectType: {
        id: string;
        text: string
    };
    hbcRole: {
        id: number;
        text: string
    };
    chairEmployee: {
        id: number;
        text: string
    };
    quarter: {
        id: number;
        text: string
    };
    magnitude: string;
    stage: {
        id: number;
        text: string
    };
    stageStatus: {
        id: string;
        text: string
    };
    location: {
        id: number;
        text: string
    };
    projectNo: string;
    job: string;
    place: string;
    region: string;
    customer: {
        id: number;
        text: string;
    };
    customerContact: {
        id: number;
        text: string
    };
    consultantUnit: string;
    consultantAddress: string;
    consultantPhone: string;
    floorArea: number;
    mainBuildingCategory: {
        id: number;
        text: string
    };
    documentLink: string;
    status: {
        id: number;
        text: string
    };
    progress: number;
    acceptanceReason: string;
    unacceptanceReason: string;
    cancelReason: string;
    evaluation: string;
    startTrackingDate: number;
    submissionDate: number;
    resultEstimatedDate: number;
    projectEstimatedStartDate: number;
    projectEstimatedEndDate: number;
    totalTime: string;
    description: string;
}
