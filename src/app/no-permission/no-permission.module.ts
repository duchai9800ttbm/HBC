import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoPermissionRoutingModule } from './no-permission-routing.module';
import { NoPermissionComponent } from './no-permission.component';

@NgModule({
  imports: [
    CommonModule,
    NoPermissionRoutingModule
  ],
  declarations: [NoPermissionComponent]
})
export class NoPermissionModule { }
