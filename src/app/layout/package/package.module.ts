import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageCreateComponent } from './package-create/package-create.component';
import { PackageEditComponent } from './package-edit/package-edit.component';
import { PackageDetailComponent } from './package-detail/package-detail.component';
import { PackageFormComponent } from './package-form/package-form.component';
import { PackageListComponent } from './package-list/package-list.component';
import { PackageRoutingModule } from './package-routing.module';

import { ActivityService } from '../../shared/services';
import { ExcelService } from '../../shared/services/excel.service';
import { DownloadTemplateService } from '../../shared/services/download-template.service';
import { SharedModule } from '../../shared/shared.module';
import { PackageComponent } from './package.component';
import { CustomerFormComponent } from './package-form/customer-form/customer-form.component';
import { NouisliderModule } from 'ng2-nouislider';
import { StarRatingModule } from '../../../../node_modules/angular-star-rating/dist';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { PackageEmailComponent } from './package-email/package-email.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};
@NgModule({
  imports: [
    StarRatingModule,
    CommonModule,
    PackageRoutingModule,
    SharedModule,
    NouisliderModule,
    PerfectScrollbarModule
  ],
  declarations: [
    PackageCreateComponent,
    PackageEditComponent,
    PackageFormComponent,
    PackageListComponent,
    PackageComponent,
    CustomerFormComponent,
    PackageEmailComponent
  ],
  providers: [
    ActivityService,
    ExcelService,
    DownloadTemplateService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class PackageModule { }
