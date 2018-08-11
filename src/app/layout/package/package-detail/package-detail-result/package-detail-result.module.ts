import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { PackageDetailResultRoutingModule } from './package-detail-result-routing.module';
import { PackageDetailResultComponent } from './package-detail-result.component';
import { WaitResultComponent } from './wait-result/wait-result.component';
import { PackageFailedComponent } from './package-failed/package-failed.component';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PackageDetailResultRoutingModule,
  ],
  declarations: [
      PackageDetailResultComponent,
      WaitResultComponent,
      PackageFailedComponent,
  ]
})
export class PackageDetailResultModule { }
