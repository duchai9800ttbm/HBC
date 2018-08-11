import {TaskSpecComponent} from './task/task-detail/task-spec/task-spec.component';
import {TaskDetailComponent} from './task/task-detail/task-detail.component';
import {TaskOverviewComponent} from './task/task-detail/task-overview/task-overview.component';
import { EventSpecComponent } from './event/event-detail/event-spec/event-spec.component';
import { EventOverviewComponent } from './event/event-detail/event-overview/event-overview.component';
import { EventDetailComponent } from './event/event-detail/event-detail.component';
import { TaskCreateComponent } from './task/task-create/task-create.component';
import { EventCreateComponent } from './event/event-create/event-create.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivityComponent } from './activity.component';
import { ActivityListComponent } from './activity-list/activity-list.component';
import { EventEditComponent } from './event/event-edit/event-edit.component';
import { TaskEditComponent } from './task/task-edit/task-edit.component';
import { EventCommentComponent } from './event/event-detail/event-comment/event-comment.component';
import { EventAuditComponent } from './event/event-detail/event-audit/event-audit.component';
import { TaskCommentComponent } from './task/task-detail/task-comment/task-comment.component';
import { TaskAuditComponent } from './task/task-detail/task-audit/task-audit.component';

const routes: Routes = [
    { path: '', redirectTo: 'list' },
    { path: 'list', pathMatch: 'full', component: ActivityListComponent },
    { path: 'event/create', component: EventCreateComponent },
    { path: 'event/edit/:id', component: EventEditComponent },
    { path: 'task/create', component: TaskCreateComponent },
    { path: 'task/edit/:id', component: TaskEditComponent },
    {
        path: 'event/detail/:id', component: EventDetailComponent,
        children: [
            { path: '', redirectTo: 'spec', pathMatch: 'full' },
            // { path: 'overview', component: EventOverviewComponent },
            { path: 'spec', component: EventSpecComponent },
            { path: 'comment', component: EventCommentComponent },
            { path: 'audit', component: EventAuditComponent },
        ]
    },
    {
        path: 'task/detail/:id', component: TaskDetailComponent,
        children: [
            { path: '', redirectTo: 'spec', pathMatch: 'full' },
            // { path: 'overview', component: TaskOverviewComponent },
            { path: 'spec', component: TaskSpecComponent },
            { path: 'comment', component: TaskCommentComponent },
            { path: 'audit', component: TaskAuditComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ActivityRoutingModule {
}
