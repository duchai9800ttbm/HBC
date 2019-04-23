import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SummaryConditionFormComponent } from './summary-condition-form.component';
import { SummaryConditionFormInfoComponent } from './summary-condition-form-info/summary-condition-form-info.component';
import { SummaryConditionFormRelatedPartiesComponent } from './summary-condition-form-related-parties/summary-condition-form-related-parties.component';
import { SummaryConditionFormScopeWorkComponent } from './summary-condition-form-scope-work/summary-condition-form-scope-work.component';
import { SummaryConditionFormNonminatedSubConstructorComponent } from './summary-condition-form-nonminated-sub-constructor/summary-condition-form-nonminated-sub-constructor.component';
import { SummaryConditionFormMainMaterialComponent } from './summary-condition-form-main-material/summary-condition-form-main-material.component';
import { SummaryConditionFormTenderSubmissionComponent } from './summary-condition-form-tender-submission/summary-condition-form-tender-submission.component';
import { SummaryConditionFormProfileDestinationComponent } from './summary-condition-form-profile-destination/summary-condition-form-profile-destination.component';
import { SummaryConditionFormTenderClarficationComponent } from './summary-condition-form-tender-clarfication/summary-condition-form-tender-clarfication.component';
import { SummaryConditionFormConditionContractComponent } from './summary-condition-form-condition-contract/summary-condition-form-condition-contract.component';
import { SummaryConditionFormConditionTenderComponent } from './summary-condition-form-condition-tender/summary-condition-form-condition-tender.component';
import { SummaryConditionFormSpecialRequirementComponent } from './summary-condition-form-special-requirement/summary-condition-form-special-requirement.component';

const routes: Routes = [
  {
    path: '',
    component: SummaryConditionFormComponent,
    children: [
      {
        path: '',
        redirectTo: 'info'
      },
      {
        path: 'info',
        component: SummaryConditionFormInfoComponent
      },
      {
        path: 'stackholder',
        component: SummaryConditionFormRelatedPartiesComponent
      },
      {
        path: 'scope',
        component: SummaryConditionFormScopeWorkComponent
      },
      {
        path: 'nonminate',
        component: SummaryConditionFormNonminatedSubConstructorComponent
      },
      {
        path: 'main-material',
        component: SummaryConditionFormMainMaterialComponent
      },
      {
        path: 'tender-submission',
        component: SummaryConditionFormTenderSubmissionComponent
      },
      {
        path: 'profile-destination',
        component: SummaryConditionFormProfileDestinationComponent
      },
      {
        path: 'tender-clarify',
        component: SummaryConditionFormTenderClarficationComponent
      },
      {
        path: 'condition-contract',
        component: SummaryConditionFormConditionContractComponent
      },
      {
        path: 'condition-tender',
        component: SummaryConditionFormConditionTenderComponent
      },
      {
        path: 'special-requirement',
        component: SummaryConditionFormSpecialRequirementComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SummaryConditionFormRoutingModule { }
