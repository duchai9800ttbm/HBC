import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactComponent } from './contact.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactCreateComponent } from './contact-create/contact-create.component';
import { ContactOverviewComponent } from './contact-detail/contact-overview/contact-overview.component';
import { ContactSpecComponent } from './contact-detail/contact-spec/contact-spec.component';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';
import { ContactEditComponent } from './contact-edit/contact-edit.component';
import { ContactAuditComponent } from './contact-detail/contact-audit/contact-audit.component';
import { ContactActivityComponent } from './contact-detail/contact-activity/contact-activity.component';
import { ContactCommentComponent } from './contact-detail/contact-comment/contact-comment.component';
import { ContactOpportunityComponent } from './contact-detail/contact-opportunity/contact-opportunity.component';

const routes: Routes = [
    { path: '', redirectTo: 'list' },
    { path: 'list', pathMatch: 'full', component: ContactListComponent },
    { path: 'create', component: ContactCreateComponent },
    { path: 'edit/:id', component: ContactEditComponent },
    {
        path: 'detail/:id', component: ContactDetailComponent,
        children: [
            { path: '', redirectTo: 'overview', pathMatch: 'full' },
            { path: 'overview', component: ContactOverviewComponent },
            { path: 'spec', component: ContactSpecComponent },
            { path: 'comment', component: ContactCommentComponent },
            { path: 'audit', component: ContactAuditComponent },
            { path: 'activity', component: ContactActivityComponent },
            { path: 'opportunity', component: ContactOpportunityComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContactRoutingModule {
}
