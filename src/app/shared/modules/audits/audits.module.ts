import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditsComponent } from './audits.component';
import { SharedPipesModule } from '../../pipes/shared-pipes.module';
import { AuditService } from '../../services/index';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    SharedPipesModule,
  ],
  declarations: [AuditsComponent],
  exports: [AuditsComponent],
  providers: [AuditService],
})
export class AuditsModule { }
