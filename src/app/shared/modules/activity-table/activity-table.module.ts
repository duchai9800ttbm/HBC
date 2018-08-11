import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityTableComponent } from './activity-table.component';
import { SharedModule } from '../../shared.module';
import { RouterModule } from '@angular/router/src/router_module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [ActivityTableComponent],
  exports: [ActivityTableComponent]
})
export class ActivityTableModule { }
