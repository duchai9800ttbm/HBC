export class PackageInfoModel {
    id: number;
    classify: string;
    amount: number;
    totalCostOfSubmission: number;
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
    hsmtStatus: {
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
        customerNewOldType: string;
    };
    customerContact: {
        id: number;
        text: string
    };
    consultantUnitCustomer: {
        id: number;
        text: string;
    };
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
    evaluation: {
        id: number,
        text: string
    };
    startTrackingDate: number;
    submissionDate: number;
    resultEstimatedDate: number;
    projectEstimatedStartDate: number;
    projectEstimatedEndDate: number;
    totalTime: string;
    description: string;
    isSubmittedHSDT: boolean;
    isClosedHSDT: boolean;
    isSendMailKickOff: boolean;
    isChotHoSo: boolean;
    interviewInvitation: {
        interviewTimes: string;
    };
    isSignedContract: boolean;
    winReasonName: string;
    loseReasonName: string;
    cancelReasonName: string;
}
