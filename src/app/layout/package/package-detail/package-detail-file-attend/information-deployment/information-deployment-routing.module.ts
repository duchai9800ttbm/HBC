import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InformationDeploymentComponent } from './information-deployment.component';
import { InformationDeploymentFormComponent } from './information-deployment-form/information-deployment-form.component';

const routes: Routes = [
  {
    path: '',
    component: InformationDeploymentComponent
  },
  {
    path: 'create',
    component: InformationDeploymentFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformationDeploymentRoutingModule { }
