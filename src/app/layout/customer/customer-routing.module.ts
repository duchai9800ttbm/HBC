import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerComponent } from './customer.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerCreateComponent } from './customer-create/customer-create.component';
import { CustomerOverviewComponent } from './customer-detail/customer-overview/customer-overview.component';
import { CustomerSpecComponent } from './customer-detail/customer-spec/customer-spec.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
import { CustomerCommentComponent } from './customer-detail/customer-comment/customer-comment.component';
import { CustomerAuditComponent } from './customer-detail/customer-audit/customer-audit.component';
import { CustomerActivityComponent } from './customer-detail/customer-activity/customer-activity.component';
import { OpportunityTableComponent } from '../../shared/modules/opportunity-table/opportunity-table.component';
import { CustomerOpportunityComponent } from './customer-detail/customer-opportunity/customer-opportunity.component';

const routes: Routes = [
    { path: '', redirectTo: 'list' },
    { path: 'list', pathMatch: 'full', component: CustomerListComponent },
    { path: 'create', component: CustomerCreateComponent },
    { path: 'edit/:id', component: CustomerEditComponent },
    {
        path: 'detail/:id', component: CustomerDetailComponent,
        children: [
            { path: '', redirectTo: 'overview', pathMatch: 'full' },
            { path: 'overview', component: CustomerOverviewComponent },
            { path: 'spec', component: CustomerSpecComponent },
            { path: 'comment', component: CustomerCommentComponent },
            { path: 'audit', component: CustomerAuditComponent },
            { path: 'activity', component: CustomerActivityComponent },
            { path: 'opportunity', component: CustomerOpportunityComponent},
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomerRoutingModule {
}
