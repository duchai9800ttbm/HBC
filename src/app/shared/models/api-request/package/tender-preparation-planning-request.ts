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
    projectDirectorEmployee: EmployeeModel;
    tenderDepartmentEmployeeId: number;
    tenderDepartmentEmployee: EmployeeModel;
    technicalDepartmentEmployeeId: number;
    technicalDepartmentEmployee: EmployeeModel;
    bimDepartmentEmployeeId: number;
    bimDepartmentEmployee: EmployeeModel;
    projectInformation: string;
    startDate: number;
    finishDate: number;
    deadline: number;
    duration: number;
    isDraftVersion = true;
    createDate: number;
    updatedDesc: string;
    isSignedByPreparedPerson = false;
    isSignedByApprovalPerson = false;
    tasks: TenderPreparationPlanItem[];
}
