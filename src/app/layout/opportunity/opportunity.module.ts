import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { OpportunityRoutingModule } from './opportunity-routing.module';
import { OpportunityComponent } from './opportunity.component';
import { OpportunityListComponent } from './opportunity-list/opportunity-list.component';
import { OpportunityMenuComponent } from './opportunity-detail/opportunity-menu/opportunity-menu.component';
import { OpportunityCreateComponent } from './opportunity-create/opportunity-create.component';
import { OpportunityDetailComponent } from './opportunity-detail/opportunity-detail.component';
import { OpportunityOverviewComponent } from './opportunity-detail/opportunity-overview/opportunity-overview.component';
import { OpportunitySpecComponent } from './opportunity-detail/opportunity-spec/opportunity-spec.component';
import { OpportunityFormComponent } from './opportunity-form/opportunity-form.component';
import { OpportunityService } from '../../shared/services/opportunity.service';
import { OpportunityEditComponent } from './opportunity-edit/opportunity-edit.component';
import { OpportunityCommentComponent } from './opportunity-detail/opportunity-comment/opportunity-comment.component';
import { OpportunityAuditComponent } from './opportunity-detail/opportunity-audit/opportunity-audit.component';
import { OpportunityActivityComponent } from './opportunity-detail/opportunity-activity/opportunity-activity.component';
import { ActivityTableModule } from '../../shared/modules/activity-table/activity-table.module';
import { AuditsListModule } from '../../shared/modules/audits-list/audits-list.module';
import { ExcelService } from '../../shared/services/excel.service';


@NgModule({
    imports: [
        SharedModule,
        OpportunityRoutingModule,
        ActivityTableModule,
        AuditsListModule
    ],
    declarations: [
        OpportunityComponent,
        OpportunityListComponent,
        OpportunityMenuComponent,
        OpportunityCreateComponent,
        OpportunityDetailComponent,
        OpportunityOverviewComponent,
        OpportunitySpecComponent,
        OpportunityFormComponent,
        OpportunityEditComponent,
        OpportunityCommentComponent,
        OpportunityAuditComponent,
        OpportunityActivityComponent,
    ],
    providers: [
        OpportunityService,
        ExcelService
    ]
})
export class OpportunityModule { }
