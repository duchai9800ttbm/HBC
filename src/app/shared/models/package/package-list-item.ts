export class PackageListItem {
    id: number;
    opportunityId: number;
    bidOpportunityId: number;
    classify: string;
    amount: number;
    opportunityName: string;
    projectName: string;
    projectType: string;
    hbcRole: {
        id: string;
        text: string;
    };
    hbcChair: string;
    trimester: string;
    magnitude: string;
    stage: {
        id: string;
        text: string;
    };
    stageStatus: {
        id: string;
        text: string;
    };
    location: string;
    projectNo: string;
    job: string;
    place: string;
    region: string;
    customerName: string;
    contact: {
        id: number;
        text: string;
    };
    customerContact: {
        id: number;
        text: string;
    };
    consultantUnit: string;
    consultantAddress: string;
    consultantPhone: string;
    floorArea: number;
    mainBuildingCategory: string;
    documentLink: string;
    status: string;
    progress: number;
    acceptanceReason: string;
    unacceptanceReason: string;
    evaluation: string;
    startTrackingDate: number;
    submissionDate: number;
    resultEstimatedDate: number;
    projectEstimatedStartDate: number;
    projectEstimatedEndDate: number;
    totalTime: number;
}
