import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformationDeploymentRoutingModule } from './information-deployment-routing.module';
import { InformationDeploymentComponent } from './information-deployment.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { CKEditorModule } from 'ng2-ckeditor';
// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { InformationDeploymentFormComponent } from './information-deployment-form/information-deployment-form.component';
import { ChangeHistoryPopupComponent } from './change-history-popup/change-history-popup.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    // CKEditorModule,
    InformationDeploymentRoutingModule,
    CKEditorModule
  ],
  declarations: [
    InformationDeploymentComponent,
    InformationDeploymentFormComponent,
    ChangeHistoryPopupComponent
  ]
})
export class InformationDeploymentModule { }
