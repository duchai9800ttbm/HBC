import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KickOffComponent } from './kick-off.component';
import { KickOffListComponent } from './kick-off-list/kick-off-list.component';
import { KickOffDetailComponent } from './kick-off-detail/kick-off-detail.component';

const routes: Routes = [{
  path: '',
  component: KickOffComponent,
  children: [
    { path: '', redirectTo: 'list' },
    { path: 'list', component: KickOffListComponent },
    { path: 'detail', component: KickOffDetailComponent },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KickOffRoutingModule { }
