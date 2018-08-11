import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditsListComponent } from './audits-list.component';
import { AuditService } from '../../services/index';
import { SharedPipesModule } from '../../pipes/shared-pipes.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    SharedPipesModule,
    TranslateModule,
  ],
  declarations: [AuditsListComponent],
  exports: [AuditsListComponent],
  providers: [AuditService]
})
export class AuditsListModule { }
