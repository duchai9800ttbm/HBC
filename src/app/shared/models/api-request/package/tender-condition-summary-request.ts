import { DictionaryItemText } from '../../dictionary-item.model';
import { WorkPackage } from '../../package/work-package';
import { TenderSubmission } from '../../package/tender-submission';
import { RequestDocument } from '../../package/request-document';
import { RequestTenderClarification } from '../../package/request-tender-clarification';
import { TenderContractCondition } from '../../package/tender-contract-condition';
import { TenderCondition } from '../../package/tender-condition';
import { TenderOtherSpecRequirement } from '../../package/tender-other-spec-requirement';
import { TenderScopeOfWork } from '../../package/tender-scope-of-work';
import { TenderNonminatedSubContractor } from '../../package/tender-nonminated-sub-contractor';
import { TenderMaterialToSupplier } from '../../package/tender-material-to-supplier';

export class TenderConditionSummaryRequest {
    bidOpportunityId: number;
    createdEmployeeId: number;
    updatedEmployeeId: number;
    isDraftVersion: boolean;
    projectInformation: {
        projectInformation: string;
        interviewTimes: number;
    };
    stakeholder: any;
    scopeOfWork: TenderScopeOfWork;
    nonminatedSubContractor: TenderNonminatedSubContractor;
    materialsTobeSuppliedOrAppointedByOwner: TenderMaterialToSupplier;
    mainItemOfTenderSubmission: TenderSubmission;
    requestDocument: RequestDocument;
    requestTenderClarification: RequestTenderClarification;
    contractCondition: TenderContractCondition;
    jsonTenderCondition: TenderCondition;
    otherSpecialRequirement: TenderOtherSpecRequirement;
}
