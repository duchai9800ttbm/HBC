import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportantComponent } from './important.component';
import { ImportantListComponent } from './important-list/important-list.component';
import { ImportantDetailComponent } from './important-detail/important-detail.component';

const routes: Routes = [{
  path: '',
  component: ImportantComponent,
  children: [
    { path: '', redirectTo: 'list' },
    { path: 'list', component: ImportantListComponent },
    { path: 'detail', component: ImportantDetailComponent },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportantRoutingModule { }
