import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiveformSiteReportComponent } from './liveform-site-report.component';
import { SurveyReportGuard } from '../../../../../../shared/services/survey-report.guard.service';

const routes: Routes = [
  { path: '', component: LiveformSiteReportComponent },
  {
    path: 'form/:action',
    loadChildren: './edit/edit.module#EditModule',
    canActivate: [SurveyReportGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [SurveyReportGuard]
})
export class LiveformSiteReportRoutingModule { }
