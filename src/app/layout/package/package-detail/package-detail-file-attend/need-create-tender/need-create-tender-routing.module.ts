import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NeedCreateTenderComponent } from './need-create-tender.component';

const routes: Routes = [
  {
    path: '',
    component: NeedCreateTenderComponent
  },
  {
    path: 'form/:action',
    loadChildren: './need-create-tender-form/need-create-tender-form.module#NeedCreateTenderFormModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NeedCreateTenderRoutingModule { }
