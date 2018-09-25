import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveformSiteReportRoutingModule } from './liveform-site-report-routing.module';
import { LiveformSiteReportComponent } from './liveform-site-report.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { SharedComponentsModule } from '../../../../../../shared/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    LiveformSiteReportRoutingModule,
    SharedComponentsModule,
    SharedModule
  ],
  declarations: [
    LiveformSiteReportComponent
  ]
})
export class LiveformSiteReportModule { }
