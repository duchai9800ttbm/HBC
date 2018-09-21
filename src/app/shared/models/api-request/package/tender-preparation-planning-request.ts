import { TenderControlBidInfo } from '../../package/tender-control-bid-info';
import { TenderSurveyConstruction } from '../../package/tender-survey-construction';
import { TenderPreparationPlanEstimate } from '../../package/tender-preparation-plan-estimate';
import { TenderTechniqueBptc } from '../../package/tender-technique-bptc';
import { TenderLegalRecord } from '../../package/tender-legal-record';
import { TenderPreparationPlanCondition } from '../../package/tender-preparation-plan-condition';

export class TenderPreparationPlanningRequest {
    bidOpportunityId: number;
    createdEmployeeId: number;
    updatedEmployeeId: number;
    projectDirectorEmployeeId: number;
    tenderDepartmentEmployeeId: number;
    technicalDepartmentEmployeeId: number;
    bimDepartmentEmployeeId: number;
    startDate: number;
    finishDate: number;
    deadline: number;
    duration: number;
    isDraftVersion: boolean;
    controlBidInformation: TenderControlBidInfo;
    surveyConstruction: TenderSurveyConstruction;
    estimate: TenderPreparationPlanEstimate;
    techniqueAndBPTC: TenderTechniqueBptc;
    legalRecord: TenderLegalRecord;
    contractCondition: TenderPreparationPlanCondition;
}
