import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrashComponent } from './trash.component';
import { TrashListComponent } from './trash-list/trash-list.component';
import { TrashDetailComponent } from './trash-detail/trash-detail.component';

const routes: Routes = [{
  path: '',
  component: TrashComponent,
  children: [
    { path: '', redirectTo: 'list' },
    { path: 'list', component: TrashListComponent },
    { path: 'detail', component: TrashDetailComponent },
  ]
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrashRoutingModule { }
