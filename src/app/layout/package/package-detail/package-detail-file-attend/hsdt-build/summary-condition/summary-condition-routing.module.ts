import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SummaryConditionComponent } from './summary-condition.component';
import { FormPreparationGuard } from '../../../../../../shared/services/form-preparation.guard.service';

const routes: Routes = [
  {
    path: '',
    component: SummaryConditionComponent
  },
  {
    path: 'form/:action',
    loadChildren: './summary-condition-form/summary-condition-form.module#SummaryConditionFormModule',
    canActivate: [FormPreparationGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [FormPreparationGuard]
})
export class SummaryConditionRoutingModule { }
