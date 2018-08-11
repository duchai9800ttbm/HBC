export class PackageModel {
    id: number;
    projectName: string;
    projectNo: string;
    opportunityName: string;
    job: string;
    place: string;
    location: string;
    trimester: string;
    customer: {
        id: number;
        text: string;
    };
    classify: string;
    customerContact: {
        id: number;
        text: string;
    };
    consultantUnit: string;
    consultantAddress: string;
    consultantPhone: string;
    floorArea: number;
    magnitude: string;
    projectType: string;
    mainBuildingCategory: string;
    hbcRole: string;
    documentLink: string;
    hbcChair: {
        id: number;
        text: string;
    };
    status: string;
    amount: number;
    evaluation: string;
    startTrackingDate: number;
    submissionDate: number;
    resultEstimatedDate: number;
    estimatedProjectStartDate: number;
    estimatedProjectEndDate: number;
    totalTime: number;
    description: string;
    quarter: string;
    stage: string;
    stageStatus: string;
    progress: number;
    acceptanceReason: string;
    unacceptanceReason: string;
}

