import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OpportunityComponent } from './opportunity.component';
import { OpportunityListComponent } from './opportunity-list/opportunity-list.component';
import { OpportunityCreateComponent } from './opportunity-create/opportunity-create.component';
import { OpportunityOverviewComponent } from './opportunity-detail/opportunity-overview/opportunity-overview.component';
import { OpportunitySpecComponent } from './opportunity-detail/opportunity-spec/opportunity-spec.component';
import { OpportunityDetailComponent } from './opportunity-detail/opportunity-detail.component';
import { OpportunityEditComponent } from './opportunity-edit/opportunity-edit.component';
import { OpportunityCommentComponent } from './opportunity-detail/opportunity-comment/opportunity-comment.component';
import { OpportunityAuditComponent } from './opportunity-detail/opportunity-audit/opportunity-audit.component';
import { OpportunityActivityComponent } from './opportunity-detail/opportunity-activity/opportunity-activity.component';

const routes: Routes = [
    { path: '', redirectTo: 'list' },
    { path: 'list', pathMatch: 'full', component: OpportunityListComponent },
    { path: 'create', component: OpportunityCreateComponent },
    { path: 'edit/:id', component: OpportunityEditComponent },
    {
        path: 'detail/:id', component: OpportunityDetailComponent,
        children: [
            { path: '', redirectTo: 'overview', pathMatch: 'full' },
            { path: 'overview', component: OpportunityOverviewComponent },
            { path: 'spec', component: OpportunitySpecComponent },
            { path: 'comment', component: OpportunityCommentComponent },
            { path: 'audit', component: OpportunityAuditComponent },
            { path: 'activity', component: OpportunityActivityComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OpportunityRoutingModule {
}
