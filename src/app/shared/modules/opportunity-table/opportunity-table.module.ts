import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpportunityTableComponent } from './opportunity-table.component';
import { SharedModule } from '../../shared.module';
import { OpportunityService } from '../../services/index';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [OpportunityTableComponent],
  exports: [OpportunityTableComponent],
  providers: [OpportunityService]
})
export class OpportunityTableModule { }
