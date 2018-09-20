import { EmployeeAnalys } from '../../package/employee-analys';
import { ConsultantAnalys } from '../../package/consultant-analys';
import { InternalResourceesEvaluation } from '../../package/internal-resourcees-evaluation';
import { EstimatedBudgetPackage } from '../../package/estimated-budget-package';
import { FeeTenderInvitationDocument } from '../../package/fee-tender-invitation-document';
import { ContractConditionTenderParticipate } from '../../package/contract-condition-tender-participate';
import { TenderDirectorProposal } from '../../package/tender-director-proposal';
import { DecisionBoardGeneralDirector } from '../../package/decision-board-general-director';
import { EmployeeModel } from '../../employee/employee-model';

export class ProposeTenderParticipateRequest {
    id: number;
    bidOpportunityId: number;
    createdEmployeeId: number;
    createdEmployee: EmployeeModel;
    updatedEmployee: EmployeeModel;
    updatedEmployeeId: number;
    documentName: string;
    isDraftVersion = true;
    employerAnalysis: EmployeeAnalys;
    consultantAnalysis: ConsultantAnalys;
    internalResourcesEvaluation: InternalResourceesEvaluation;
    estimatedBudgetOfPakage: EstimatedBudgetPackage;
    feeOfTenderInvitationDocument: FeeTenderInvitationDocument;
    contractCondition: ContractConditionTenderParticipate;
    tenderDirectorProposal: TenderDirectorProposal;
    decisionOfBoardOfGeneralDirector: DecisionBoardGeneralDirector;
    isAgreedParticipating = true;
}
