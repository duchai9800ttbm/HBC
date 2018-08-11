import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { CampaignRoutingModule } from './campaign-routing.module';
import { CampaignComponent } from './campaign.component';
import { CampaignListComponent } from './campaign-list/campaign-list.component';
import { CampaignMenuComponent } from './campaign-detail/campaign-menu/campaign-menu.component';
import { CampaignCreateComponent } from './campaign-create/campaign-create.component';
import { CampaignDetailComponent } from './campaign-detail/campaign-detail.component';
import { CampaignOverviewComponent } from './campaign-detail/campaign-overview/campaign-overview.component';
import { CampaignSpecComponent } from './campaign-detail/campaign-spec/campaign-spec.component';
import { CampaignFormComponent } from './campaign-form/campaign-form.component';
import { CampaignService } from '../../shared/services/campaign.service';
import { CampaignEditComponent } from './campaign-edit/campaign-edit.component';
import { CampaignCommentComponent } from './campaign-detail/campaign-comment/campaign-comment.component';
import { CampaignAuditComponent } from './campaign-detail/campaign-audit/campaign-audit.component';
import { CampaignActivityComponent } from './campaign-detail/campaign-activity/campaign-activity.component';
import { ActivityTableModule } from '../../shared/modules/activity-table/activity-table.module';
import { AuditsListModule } from '../../shared/modules/audits-list/audits-list.module';
import { ExcelService } from '../../shared/services/excel.service';

@NgModule({
    imports: [
        SharedModule,
        CampaignRoutingModule,
        ActivityTableModule,
        AuditsListModule
    ],
    declarations: [
        CampaignComponent,
        CampaignListComponent,
        CampaignMenuComponent,
        CampaignCreateComponent,
        CampaignDetailComponent,
        CampaignOverviewComponent,
        CampaignSpecComponent,
        CampaignFormComponent,
        CampaignEditComponent,
        CampaignCommentComponent,
        CampaignAuditComponent,
        CampaignActivityComponent,
    ],
    providers: [
        CampaignService,
        ExcelService
    ]
})
export class CampaignModule { }
