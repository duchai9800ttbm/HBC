import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CampaignComponent } from './campaign.component';
import { CampaignListComponent } from './campaign-list/campaign-list.component';
import { CampaignCreateComponent } from './campaign-create/campaign-create.component';
import { CampaignOverviewComponent } from './campaign-detail/campaign-overview/campaign-overview.component';
import { CampaignSpecComponent } from './campaign-detail/campaign-spec/campaign-spec.component';
import { CampaignDetailComponent } from './campaign-detail/campaign-detail.component';
import { CampaignEditComponent } from './campaign-edit/campaign-edit.component';
import { CampaignCommentComponent } from './campaign-detail/campaign-comment/campaign-comment.component';
import { CampaignAuditComponent } from './campaign-detail/campaign-audit/campaign-audit.component';
import { CampaignActivityComponent } from './campaign-detail/campaign-activity/campaign-activity.component';

const routes: Routes = [
    { path: '', redirectTo: 'list' },
    { path: 'list', pathMatch: 'full', component: CampaignListComponent },
    { path: 'create', component: CampaignCreateComponent },
    { path: 'edit/:id', component: CampaignEditComponent },
    {
        path: 'detail/:id', component: CampaignDetailComponent,
        children: [
            { path: '', redirectTo: 'spec', pathMatch: 'full' },
            //{ path: 'overview', component: CampaignOverviewComponent },
            { path: 'spec', component: CampaignSpecComponent },
            { path: 'comment', component: CampaignCommentComponent },
            { path: 'audit', component: CampaignAuditComponent },
            { path: 'activity', component: CampaignActivityComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CampaignRoutingModule {
}
