import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GiveUpComponent } from './give-up.component';
import { GiveUpListComponent } from './give-up-list/give-up-list.component';
import { GiveUpDetailComponent } from './give-up-detail/give-up-detail.component';

const routes: Routes = [{
  path: '',
  component: GiveUpComponent,
  children: [
    { path: '', redirectTo: 'list' },
    { path: 'list', component: GiveUpListComponent },
    { path: 'detail', component: GiveUpDetailComponent },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GiveUpRoutingModule { }
