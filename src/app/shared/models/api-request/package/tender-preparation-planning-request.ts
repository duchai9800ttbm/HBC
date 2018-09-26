import { TenderPreparationPlanItem } from '../../package/tender-preparation-plan-item';
import { EmployeeModel } from '../../employee/employee-model';

export class TenderPreparationPlanningRequest {
    id: number;
    bidOpportunityId: number;
    createdEmployeeId: number;
    createdEmployee: EmployeeModel;
    updatedEmployee: EmployeeModel;
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
