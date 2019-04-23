import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssignComponent } from './assign.component';
import { AssignListComponent } from './assign-list/assign-list.component';
import { AssignDetailComponent } from './assign-detail/assign-detail.component';

const routes: Routes = [{
  path: '',
  component: AssignComponent,
  children: [
    { path: '', redirectTo: 'list' },
    { path: 'list', component: AssignListComponent },
    { path: 'detail', component: AssignDetailComponent },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignRoutingModule { }
