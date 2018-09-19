import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiveformSiteReportComponent } from './liveform-site-report.component';

const routes: Routes = [
  { path: '', component: LiveformSiteReportComponent },
  { path: 'info', loadChildren: './edit/edit.module#EditModule'},
  { path: 'edit', loadChildren: './edit/edit.module#EditModule'},
  { path: 'create', loadChildren: './edit/edit.module#EditModule'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiveformSiteReportRoutingModule { }
