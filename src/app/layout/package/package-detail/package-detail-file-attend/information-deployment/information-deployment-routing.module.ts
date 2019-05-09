import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InformationDeploymentComponent } from './information-deployment.component';
import { InformationDeploymentFormComponent } from './information-deployment-form/information-deployment-form.component';
import { ImformationDeploymentGuard } from '../../../../../shared/services/information-deployment.guard.service';

const routes: Routes = [
  {
    path: '',
    component: InformationDeploymentComponent
  },
  {
    path: ':action',
    component: InformationDeploymentFormComponent,
    canActivate: [ImformationDeploymentGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ImformationDeploymentGuard]
})
export class InformationDeploymentRoutingModule { }
