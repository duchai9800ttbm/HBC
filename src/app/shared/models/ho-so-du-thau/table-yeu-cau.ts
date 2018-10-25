export class TableYeuCauDacBiet {
    tenderEvaluation: string;
    tenderEvaluationSteps: string;
    tenderEvaluationStep1: string;
    tenderEvaluationStep2: string;
    requirementDetails: RequirementDetail[];
}

export class RequirementDetail {
    requirementName: string;
    requirementDesc: string;
    requirementLink: string;
}
