import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SummaryConditionFormRoutingModule } from './summary-condition-form-routing.module';
import { SummaryConditionFormComponent } from './summary-condition-form.component';
import { SummaryConditionFormInfoComponent } from './summary-condition-form-info/summary-condition-form-info.component';
import { SharedDirectivesModule } from '../../../../../../../shared/directives/shared-directives.module';
import { SummaryConditionFormRelatedPartiesComponent } from './summary-condition-form-related-parties/summary-condition-form-related-parties.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../../../../../shared/shared.module';
import { SummaryConditionFormScopeWorkComponent } from './summary-condition-form-scope-work/summary-condition-form-scope-work.component';
import { SummaryConditionFormNonminatedSubConstructorComponent } from './summary-condition-form-nonminated-sub-constructor/summary-condition-form-nonminated-sub-constructor.component';
import { SummaryConditionFormMainMaterialComponent } from './summary-condition-form-main-material/summary-condition-form-main-material.component';
import { SummaryConditionFormTenderSubmissionComponent } from './summary-condition-form-tender-submission/summary-condition-form-tender-submission.component';
import { SummaryConditionFormProfileDestinationComponent } from './summary-condition-form-profile-destination/summary-condition-form-profile-destination.component';
import { SummaryConditionFormTenderClarficationComponent } from './summary-condition-form-tender-clarfication/summary-condition-form-tender-clarfication.component';
import { SummaryConditionFormConditionContractComponent } from './summary-condition-form-condition-contract/summary-condition-form-condition-contract.component';
import { SummaryConditionFormConditionTenderComponent } from './summary-condition-form-condition-tender/summary-condition-form-condition-tender.component';
import { SummaryConditionFormSpecialRequirementComponent } from './summary-condition-form-special-requirement/summary-condition-form-special-requirement.component';
import { PopupUpdateDescriptionComponent } from './popup-update-description/popup-update-description.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SummaryConditionFormRoutingModule
  ],
  declarations: [
    SummaryConditionFormComponent,
    SummaryConditionFormInfoComponent,
    SummaryConditionFormRelatedPartiesComponent,
    SummaryConditionFormScopeWorkComponent,
    SummaryConditionFormNonminatedSubConstructorComponent,
    SummaryConditionFormMainMaterialComponent,
    SummaryConditionFormTenderSubmissionComponent,
    SummaryConditionFormProfileDestinationComponent,
    SummaryConditionFormTenderClarficationComponent,
    SummaryConditionFormConditionContractComponent,
    SummaryConditionFormConditionTenderComponent,
    SummaryConditionFormSpecialRequirementComponent,
    PopupUpdateDescriptionComponent
  ]
})
export class SummaryConditionFormModule { }
