import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiveformSiteReportRoutingModule } from './liveform-site-report-routing.module';
import { EditComponent } from './edit/edit.component';
import { LiveformSiteReportComponent } from './liveform-site-report.component';

@NgModule({
  imports: [
    CommonModule,
    LiveformSiteReportRoutingModule
  ],
  declarations: [
    LiveformSiteReportComponent,
    EditComponent
  ]
})
export class LiveformSiteReportModule { }
