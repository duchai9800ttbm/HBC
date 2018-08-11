import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { ProspectRoutingModule } from './prospect-routing.module';
import { ProspectComponent } from './prospect.component';
import { ProspectListComponent } from './prospect-list/prospect-list.component';
import { ProspectDetailComponent } from './prospect-detail/prospect-detail.component';
import { ProspectMenuComponent } from './prospect-detail/prospect-menu/prospect-menu.component';
import { ProspectCreateComponent } from './prospect-create/prospect-create.component';
import { ProspectSpecComponent } from './prospect-detail/prospect-spec/prospect-spec.component';
import { ProspectOverviewComponent } from './prospect-detail/prospect-overview/prospect-overview.component';
import { ConvertProspectModalComponent } from './prospect-detail/convert-prospect-modal/convert-prospect-modal.component';
import { ProspectFormComponent } from './prospect-form/prospect-form.component';
import { ProspectService } from '../../shared/services/prospect.service';
import { ProspectEditComponent } from './prospect-edit/prospect-edit.component';
import { ProspectCommentComponent } from './prospect-detail/prospect-comment/prospect-comment.component';
import { ProspectAuditComponent } from './prospect-detail/prospect-audit/prospect-audit.component';
import { ProspectActivityComponent } from './prospect-detail/prospect-activity/prospect-activity.component';
import { ActivityTableModule } from '../../shared/modules/activity-table/activity-table.module';
import { AuditsListModule } from '../../shared/modules/audits-list/audits-list.module';
import { ProspectDetailHistoryComponent } from './prospect-detail-history/prospect-detail-history.component';
import { ExcelService } from '../../shared/services/excel.service';
import { DownloadTemplateService } from '../../shared/services/download-template.service';
import { ProspectActivityHistoryComponent } from './prospect-detail-history/prospect-activity-history/prospect-activity-history.component';
import { ProspectAuditHistoryComponent } from './prospect-detail-history/prospect-audit-history/prospect-audit-history.component';
import { ProspectCommentHistoryComponent } from './prospect-detail-history/prospect-comment-history/prospect-comment-history.component';
import { ProspectMenuHistoryComponent } from './prospect-detail-history/prospect-menu-history/prospect-menu-history.component';
import { ProspectOverviewHistoryComponent } from './prospect-detail-history/prospect-overview-history/prospect-overview-history.component';
import { ProspectSpecHistoryComponent } from './prospect-detail-history/prospect-spec-history/prospect-spec-history.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { CampaignService } from '../../shared/services';


@NgModule({
    imports: [
        ProspectRoutingModule,
        SharedModule,
        ActivityTableModule,
        AuditsListModule,
    ],
    declarations: [
        ProspectComponent,
        ProspectListComponent,
        ProspectDetailComponent,
        ProspectMenuComponent,
        ProspectCreateComponent,
        ProspectOverviewComponent,
        ProspectSpecComponent,
        ConvertProspectModalComponent,
        ProspectFormComponent,
        ProspectEditComponent,
        ProspectCommentComponent,
        ProspectAuditComponent,
        ProspectActivityComponent,
        ProspectDetailHistoryComponent,
        ProspectActivityHistoryComponent,
        ProspectAuditHistoryComponent,
        ProspectCommentHistoryComponent,
        ProspectMenuHistoryComponent,
        ProspectOverviewHistoryComponent,
        ProspectSpecHistoryComponent
    ],
    entryComponents: [
        ConvertProspectModalComponent,
    ],
    exports: [
        ConvertProspectModalComponent
    ],
    providers: [
        ProspectService,
        ExcelService,
        DownloadTemplateService,
        NgbActiveModal,
        CampaignService
    ]

})
export class ProspectModule { }
