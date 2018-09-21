import { EmployeeModel } from '../employee/employee-model';

export class TenderDistribution {
    desc: string;
    whoIsInChargeIds: number[];
    whoIsInChargeEmployees: EmployeeModel[];
    isFinish: boolean;
    startDate: number;
    finishDate: number;
    duration: number;
}
