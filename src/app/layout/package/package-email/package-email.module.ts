import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PackageEmailRoutingModule } from './package-email-routing.module';
import { TrashComponent } from './trash/trash.component';
import { SharedModule } from '../../../shared/shared.module';
import { PackageEmailComponent } from './package-email.component';

@NgModule({
  imports: [
    CommonModule,
    PackageEmailRoutingModule,
    SharedModule,

  ],
  declarations: [
    PackageEmailComponent
  ]
})
export class PackageEmailModule { }
