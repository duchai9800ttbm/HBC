import { NgModule } from '@angular/core';
import { InformationDeploymentComponent} from './information-deployment/information-deployment.component';
import { Routes, RouterModule } from '@angular/router';
import { PackageDetailFileAttendComponent } from './package-detail-file-attend.component';
import { PriceReviewComponent } from './price-review/price-review.component';
import { PriceReportSubmitedComponent } from './price-report-submited/price-report.component';
import { PriceReportCreateComponent } from './price-report-create/price-report-create.component';
import { HsdtPendingComponent } from './hsdt-pending/hsdt-pending.component';
import { HsdtSignedComponent } from './hsdt-signed/hsdt-signed.component';
import { HsdtSubmittedComponent } from './hsdt-submitted/hsdt-submitted.component';
const routes: Routes = [
  {
   path: '',
   component: PackageDetailFileAttendComponent,
   children: [
   { path: '', redirectTo: 'infomation-deployment' },
   { path: 'infomation-deployment', component: InformationDeploymentComponent },
   { path: 'price-review', component: PriceReviewComponent },
   { path: 'price-report', component: PriceReportSubmitedComponent },
   { path: 'price-report-create', component: PriceReportCreateComponent},
   { path: 'pending', component: HsdtPendingComponent},
   { path: 'signed', component: HsdtSignedComponent},
   { path: 'submited', component: HsdtSubmittedComponent}
   ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackageDetailFileAttendRoutingModule { }
