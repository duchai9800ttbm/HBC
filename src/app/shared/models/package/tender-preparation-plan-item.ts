import { UserItemModel } from "../user/user-item.model";

export class TenderPreparationPlanItem {
    itemId: number;
    itemNo: string;
    itemName: string;
    itemDesc: string;
    whoIsInChargeId: number;
    whoIsInCharges: UserItemModel[];
    whoIsInChargeIds ?: UserItemModel[];
    whoIsInCharge: UserItemModel;
    startDate: number;
    finishDate: number;
    duration: number;
    isFinish = false;
}
