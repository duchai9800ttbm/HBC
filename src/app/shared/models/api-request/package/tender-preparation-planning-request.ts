import { TenderPreparationPlanItem } from '../../package/tender-preparation-plan-item';

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
    tasks: TenderPreparationPlanItem[];
}
