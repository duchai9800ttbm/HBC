import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiveformSiteReportComponent } from './liveform-site-report.component';
import { InfoComponent } from './info/info.component';

const routes: Routes = [
  { path: '', component: LiveformSiteReportComponent },
  { path: 'info/:id', loadChildren: './info/info.module#InfoModule'},
  { path: 'edit/:id', loadChildren: './edit/edit.module#EditModule'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiveformSiteReportRoutingModule { }
