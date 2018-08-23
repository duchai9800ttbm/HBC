import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SummaryConditionComponent } from './summary-condition.component';

const routes: Routes = [
  {
    path: '',
    component: SummaryConditionComponent
  },
  {
    path: 'form/:action',
    loadChildren: './summary-condition-form/summary-condition-form.module#SummaryConditionFormModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SummaryConditionRoutingModule { }
