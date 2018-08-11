import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageDetailInfoComponent } from './package-detail-info/package-detail-info.component';
import { SharedModule } from '../../../shared/shared.module';
import { PackageDetailRoutingModule } from './package-detail-routing.module';
import { PackageDetailComponent } from './package-detail.component';
import { PackageDetailFileAttendComponent } from './package-detail-file-attend/package-detail-file-attend.component';
import { PackageDetailResultComponent } from './package-detail-result/package-detail-result.component';
import { PackageEdit2Component } from './package-edit-2/package-edit-2.component';
import { InformationComponent } from './package-detail-info/information/information.component';
import { InformationDeploymentComponent } from './package-detail-file-attend/information-deployment/information-deployment.component';

@NgModule({
  imports: [
    CommonModule,
    PackageDetailRoutingModule,
    SharedModule,
  ],
  declarations: [
    PackageDetailComponent,
    // PackageDetailFileAttendComponent,
    // PackageDetailResultComponent,
    PackageEdit2Component,
    // InformationDeploymentComponent
  ]
})
export class PackageDetailModule { }
