import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NeedCreateTenderComponent } from './need-create-tender.component';
import { FormEditProposedGuard } from '../../../../../shared/services/form-edit-proposed.guard.service';

const routes: Routes = [
  {
    path: '',
    component: NeedCreateTenderComponent
  },
  {
    path: 'form/:action',
    loadChildren: './need-create-tender-form/need-create-tender-form.module#NeedCreateTenderFormModule',
    canActivate: [FormEditProposedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [FormEditProposedGuard]
})
export class NeedCreateTenderRoutingModule { }
