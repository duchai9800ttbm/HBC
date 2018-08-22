import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GiveUpRoutingModule } from './give-up-routing.module';
import { GiveUpListComponent } from './give-up-list/give-up-list.component';
import { GiveUpDetailComponent } from './give-up-detail/give-up-detail.component';
import { GiveUpComponent } from './give-up.component';
import { SharedModule } from '../../../../shared/shared.module';
import { EmailDetailModule } from '../email-detail/email-detail.module';

@NgModule({
  imports: [
    CommonModule,
    GiveUpRoutingModule,
    SharedModule,
    EmailDetailModule
  ],
  declarations: [
    GiveUpComponent,
    GiveUpListComponent,
    GiveUpDetailComponent
  ]
})
export class GiveUpModule { }
