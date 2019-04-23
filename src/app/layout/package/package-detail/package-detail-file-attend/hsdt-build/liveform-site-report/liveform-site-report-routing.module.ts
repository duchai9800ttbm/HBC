import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiveformSiteReportComponent } from './liveform-site-report.component';

const routes: Routes = [
  { path: '', component: LiveformSiteReportComponent },
  { path: 'form/:action', loadChildren: './edit/edit.module#EditModule'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiveformSiteReportRoutingModule { }
