import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SummaryConditionRoutingModule } from './summary-condition-routing.module';
import { SummaryConditionComponent } from './summary-condition.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { SummaryConditionCreateComponent } from './summary-condition-create/summary-condition-create.component';
import { SummaryConditionEditComponent } from './summary-condition-edit/summary-condition-edit.component';
import { SummaryConditionDetailComponent } from './summary-condition-detail/summary-condition-detail.component';
import { SummaryConditionOverviewComponent } from './summary-condition-overview/summary-condition-overview.component';
import { HoSoDuThauService } from '../../../../../../shared/services/ho-so-du-thau.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SummaryConditionRoutingModule
  ],
  declarations: [
    SummaryConditionComponent,
    SummaryConditionCreateComponent,
    SummaryConditionEditComponent,
    SummaryConditionDetailComponent,
    SummaryConditionOverviewComponent,
  ],
  providers: [
    HoSoDuThauService
  ]
})
export class SummaryConditionModule { }
