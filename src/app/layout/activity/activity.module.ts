import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { EventCreateComponent } from './event/event-create/event-create.component';
import { EventMenuComponent } from './event/event-detail/event-menu/event-menu.component';
import { EventDetailComponent } from './event/event-detail/event-detail.component';
import { EventSpecComponent } from './event/event-detail/event-spec/event-spec.component';
import { EventOverviewComponent } from './event/event-detail/event-overview/event-overview.component';
import { TaskMenuComponent } from './task/task-detail/task-menu/task-menu.component';
import { TaskCreateComponent } from './task/task-create/task-create.component';
import { TaskDetailComponent } from './task/task-detail/task-detail.component';
import { TaskOverviewComponent } from './task/task-detail/task-overview/task-overview.component';
import { TaskSpecComponent } from './task/task-detail/task-spec/task-spec.component';
import { ActivityRoutingModule } from './activity-routing.module';
import { ActivityComponent } from './activity.component';
import { ActivityListComponent } from './activity-list/activity-list.component';
import { EventFormComponent } from './event/event-form/event-form.component';
import { TaskFormComponent } from './task/task-form/task-form.component';
import { ActivityService } from '../../shared/services/activity.service';
import { EventEditComponent } from './event/event-edit/event-edit.component';
import { TaskEditComponent } from './task/task-edit/task-edit.component';
import { EventCommentComponent } from './event/event-detail/event-comment/event-comment.component';
import { EventAuditComponent } from './event/event-detail/event-audit/event-audit.component';
import { TaskCommentComponent } from './task/task-detail/task-comment/task-comment.component';
import { TaskAuditComponent } from './task/task-detail/task-audit/task-audit.component';
import { AuditsListModule } from '../../shared/modules/audits-list/audits-list.module';
import { ExcelService } from '../../shared/services/excel.service';
import { DownloadTemplateService } from '../../shared/services/download-template.service';

@NgModule({
    imports: [
        ActivityRoutingModule,
        SharedModule,
        AuditsListModule
    ],
    declarations: [
        ActivityComponent,
        ActivityListComponent,
        EventMenuComponent,
        EventCreateComponent,
        EventDetailComponent,
        EventOverviewComponent,
        EventSpecComponent,
        TaskMenuComponent,
        TaskCreateComponent,
        TaskDetailComponent,
        TaskOverviewComponent,
        TaskSpecComponent,
        EventFormComponent,
        TaskFormComponent,
        EventEditComponent,
        TaskEditComponent,
        EventCommentComponent,
        EventAuditComponent,
        TaskCommentComponent,
        TaskAuditComponent,
    ],
    providers: [
        ActivityService,
        ExcelService,
        DownloadTemplateService
    ]
})
export class ActivityModule { }
