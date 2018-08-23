import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SummaryConditionFormComponent } from './summary-condition-form.component';
import { SummaryConditionFormInfoComponent } from './summary-condition-form-info/summary-condition-form-info.component';

const routes: Routes = [
  {
    path: '',
    component: SummaryConditionFormComponent,
    children: [
      {
        path: '',
        redirectTo: 'info'
      },
      {
        path: 'info',
        component: SummaryConditionFormInfoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SummaryConditionFormRoutingModule { }
