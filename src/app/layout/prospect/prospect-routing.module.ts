import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProspectComponent } from './prospect.component';
import { ProspectListComponent } from './prospect-list/prospect-list.component';
import { ProspectDetailComponent } from './prospect-detail/prospect-detail.component';
import { ProspectCreateComponent } from './prospect-create/prospect-create.component';
import { ProspectOverviewComponent } from './prospect-detail/prospect-overview/prospect-overview.component';
import { ProspectSpecComponent } from './prospect-detail/prospect-spec/prospect-spec.component';
import { ProspectEditComponent } from './prospect-edit/prospect-edit.component';
import { ProspectCommentComponent } from './prospect-detail/prospect-comment/prospect-comment.component';
import { ProspectAuditComponent } from './prospect-detail/prospect-audit/prospect-audit.component';
import { ProspectActivityComponent } from './prospect-detail/prospect-activity/prospect-activity.component';
import { ProspectDetailHistoryComponent } from './prospect-detail-history/prospect-detail-history.component';
import { ProspectOverviewHistoryComponent } from './prospect-detail-history/prospect-overview-history/prospect-overview-history.component';
import { ProspectSpecHistoryComponent } from './prospect-detail-history/prospect-spec-history/prospect-spec-history.component';
import { ProspectCommentHistoryComponent } from './prospect-detail-history/prospect-comment-history/prospect-comment-history.component';
import { ProspectAuditHistoryComponent } from './prospect-detail-history/prospect-audit-history/prospect-audit-history.component';
import { ProspectActivityHistoryComponent } from './prospect-detail-history/prospect-activity-history/prospect-activity-history.component';
const routes: Routes = [
    { path: '', redirectTo: 'list' },
    { path: 'list', pathMatch: 'full', component: ProspectListComponent },
    { path: 'create', component: ProspectCreateComponent },
    { path: 'edit/:id', component: ProspectEditComponent },
    {
        path: 'detail-history/:id', component: ProspectDetailHistoryComponent,
        children: [
            { path: '', redirectTo: 'overview', pathMatch: 'full' },
            { path: 'overview', component: ProspectOverviewHistoryComponent },
            { path: 'spec', component: ProspectSpecHistoryComponent },
            { path: 'comment', component: ProspectCommentHistoryComponent },
            { path: 'audit', component: ProspectAuditHistoryComponent },
            { path: 'activity', component: ProspectActivityHistoryComponent },
        ]
    },
    {
        path: 'detail/:id', component: ProspectDetailComponent,
        children: [
            { path: '', redirectTo: 'overview', pathMatch: 'full' },
            { path: 'overview', component: ProspectOverviewComponent },
            { path: 'spec', component: ProspectSpecComponent },
            { path: 'comment', component: ProspectCommentComponent },
            { path: 'audit', component: ProspectAuditComponent },
            { path: 'activity', component: ProspectActivityComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProspectRoutingModule {
}
