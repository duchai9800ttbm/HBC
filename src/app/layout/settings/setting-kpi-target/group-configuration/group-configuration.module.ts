import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { GroupConfigurationroutingModule } from './group-configuration-routing.module';
import { GroupConfigurationListComponent } from './group-configuration-list/group-configuration-list.component';
import { GroupConfigurationComponent } from './group-configuration.component';
import { GroupConfigurationFormComponent } from './group-configuration-form/group-configuration-form.component';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    GroupConfigurationroutingModule
  ],
  declarations: [
    GroupConfigurationListComponent,
    GroupConfigurationComponent,
    GroupConfigurationFormComponent,
  ]
})
export class GroupConfigurationModule { }
