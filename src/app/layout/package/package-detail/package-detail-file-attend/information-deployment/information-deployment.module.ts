import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformationDeploymentRoutingModule } from './information-deployment-routing.module';
import { InformationDeploymentComponent } from './information-deployment.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { CKEditorModule } from 'ng2-ckeditor';
import { InformationDeploymentFormComponent } from './information-deployment-form/information-deployment-form.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CKEditorModule,
    InformationDeploymentRoutingModule
  ],
  declarations: [
    InformationDeploymentComponent,
    InformationDeploymentFormComponent
  ]
})
export class InformationDeploymentModule { }
