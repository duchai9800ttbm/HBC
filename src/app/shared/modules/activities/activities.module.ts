import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitiesComponent } from './activities.component';
import { ActivityService } from '../../services/index';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap/dropdown/dropdown';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap/dropdown/dropdown.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule.forRoot(),
    TranslateModule,
  ],
  declarations: [ActivitiesComponent],
  exports: [ActivitiesComponent],
  providers: [ActivityService],
})
export class ActivitiesModule { }
