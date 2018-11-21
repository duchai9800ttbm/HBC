import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NeedCreateTenderFormRoutingModule } from './need-create-tender-form-routing.module';
import { NeedCreateTenderFormComponent } from './need-create-tender-form.component';
import { NeedCreateTenderFormAnalysisComponent } from './need-create-tender-form-analysis/need-create-tender-form-analysis.component';
// tslint:disable-next-line:max-line-length
import { NeedCreateTenderFormConsultantAnalysisComponent } from './need-create-tender-form-consultant-analysis/need-create-tender-form-consultant-analysis.component';
import { NeedCreateTenderFormResourceEvaluationComponent } from './need-create-tender-form-resource-evaluation/need-create-tender-form-resource-evaluation.component';
// tslint:disable-next-line:max-line-length
import { NeedCreateTenderFormEstimatedBudgetComponent } from './need-create-tender-form-estimated-budget/need-create-tender-form-estimated-budget.component';
import { NeedCreateTenderFormFeeTenderComponent } from './need-create-tender-form-fee-tender/need-create-tender-form-fee-tender.component';
// tslint:disable-next-line:max-line-length
import { NeedCreateTenderFormContractConditionComponent } from './need-create-tender-form-contract-condition/need-create-tender-form-contract-condition.component';
import { NeedCreateTenderFormDirectorProposalComponent } from './need-create-tender-form-director-proposal/need-create-tender-form-director-proposal.component';
// tslint:disable-next-line:max-line-length
import { NeedCreateTenderFormDecisionBoardComponent } from './need-create-tender-form-decision-board/need-create-tender-form-decision-board.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import {
    NeedCreateTenderFormImagesProjectComponent
} from './need-create-tender-form-images-project/need-create-tender-form-images-project.component';

@NgModule({
    imports: [
        CommonModule,
        NeedCreateTenderFormRoutingModule,
        SharedModule
    ],
    declarations: [
        NeedCreateTenderFormComponent,
        NeedCreateTenderFormAnalysisComponent,
        NeedCreateTenderFormConsultantAnalysisComponent,
        NeedCreateTenderFormResourceEvaluationComponent,
        NeedCreateTenderFormEstimatedBudgetComponent,
        NeedCreateTenderFormFeeTenderComponent,
        NeedCreateTenderFormContractConditionComponent,
        NeedCreateTenderFormDirectorProposalComponent,
        NeedCreateTenderFormDecisionBoardComponent,
        NeedCreateTenderFormImagesProjectComponent
    ]
})
export class NeedCreateTenderFormModule { }
