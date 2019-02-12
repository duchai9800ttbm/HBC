import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GroupConfigurationComponent } from './group-configuration.component';
import { GroupConfigurationListComponent } from './group-configuration-list/group-configuration-list.component';
import { GroupConfigurationFormComponent } from './group-configuration-form/group-configuration-form.component';
const routes: Routes = [
  {
    path: '',
    component: GroupConfigurationComponent,
    children: [
      {
        path: '',
        redirectTo: 'list'
      },
      {
        path: 'list',
        component: GroupConfigurationListComponent
      },
      {
        path: 'create',
        component: GroupConfigurationFormComponent
      },
      {
        path: 'edit/:id',
        component: GroupConfigurationFormComponent
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupConfigurationroutingModule { }
