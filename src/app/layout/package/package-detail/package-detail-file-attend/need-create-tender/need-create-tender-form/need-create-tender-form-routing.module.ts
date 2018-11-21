import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
import { NeedCreateTenderFormImagesProjectComponent } from './need-create-tender-form-images-project/need-create-tender-form-images-project.component';

const routes: Routes = [
  {
    path: '',
    component: NeedCreateTenderFormComponent,
    children: [
      {
        path: '',
        redirectTo: 'employer-analys'
      },
      {
        path: 'employer-analys',
        component: NeedCreateTenderFormAnalysisComponent
      },
      {
        path: 'consultant-analys',
        component: NeedCreateTenderFormConsultantAnalysisComponent
      },
      {
        path: 'internal-resource',
        component: NeedCreateTenderFormResourceEvaluationComponent
      },
      {
        path: 'estimated-budget',
        component: NeedCreateTenderFormEstimatedBudgetComponent
      },
      {
        path: 'fee-tender',
        component: NeedCreateTenderFormFeeTenderComponent
      },
      {
        path: 'contract-condition',
        component: NeedCreateTenderFormContractConditionComponent
      },
      {
        path: 'director-proposal',
        component: NeedCreateTenderFormDirectorProposalComponent
      },
      {
        path: 'descion-board',
        component: NeedCreateTenderFormDecisionBoardComponent
      },
      {
        path: 'images-project',
        component: NeedCreateTenderFormImagesProjectComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NeedCreateTenderFormRoutingModule { }
