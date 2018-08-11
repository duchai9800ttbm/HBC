import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerMenuComponent } from './customer-detail/customer-menu/customer-menu.component';
import { CustomerCreateComponent } from './customer-create/customer-create.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { CustomerOverviewComponent } from './customer-detail/customer-overview/customer-overview.component';
import { CustomerSpecComponent } from './customer-detail/customer-spec/customer-spec.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { CustomerService } from '../../shared/services/index';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
import { CustomerCommentComponent } from './customer-detail/customer-comment/customer-comment.component';
import { CustomerAuditComponent } from './customer-detail/customer-audit/customer-audit.component';
import { CustomerActivityComponent } from './customer-detail/customer-activity/customer-activity.component';
import { ActivityTableModule } from '../../shared/modules/activity-table/activity-table.module';
import { AuditsListModule } from '../../shared/modules/audits-list/audits-list.module';
import { ExcelService } from '../../shared/services/excel.service';
import { CustomerOpportunityComponent } from './customer-detail/customer-opportunity/customer-opportunity.component';
import { OpportunityTableModule } from '../../shared/modules/opportunity-table/opportunity-table.module';
import { DownloadTemplateService } from '../../shared/services/download-template.service';
import { ListContactComponent } from './customer-detail/customer-overview/list-contact/list-contact.component';
import { StarRatingModule } from 'angular-star-rating';


@NgModule({
    imports: [
        StarRatingModule,
        SharedModule,
        CustomerRoutingModule,
        ActivityTableModule,
        AuditsListModule,
        OpportunityTableModule,
    ],
    declarations: [
        CustomerComponent,
        CustomerListComponent,
        CustomerMenuComponent,
        CustomerCreateComponent,
        CustomerDetailComponent,
        CustomerOverviewComponent,
        CustomerSpecComponent,
        CustomerFormComponent,
        CustomerEditComponent,
        CustomerCommentComponent,
        CustomerAuditComponent,
        CustomerActivityComponent,
        CustomerOpportunityComponent,
        ListContactComponent,

    ],
    providers: [
        CustomerService,
        ExcelService,
        DownloadTemplateService
    ]
})
export class CustomerModule { }
