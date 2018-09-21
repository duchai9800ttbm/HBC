import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PriceReviewRoutingModule } from './price-review-routing.module';
import { PriceReviewSummaryComponent } from './price-review-summary/price-review-summary.component';
import { PriceReviewDetailComponent } from './price-review-detail/price-review-detail.component';
import { PriceReviewFormComponent } from './price-review-form/price-review-form.component';
import { PriceReviewEditComponent } from './price-review-edit/price-review-edit.component';
import { PriceReviewCreateComponent } from './price-review-create/price-review-create.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { PriceReviewComponent } from './price-review.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommentComponent } from './price-review-form/comment/comment.component';
import { PriceReviewService } from '../../../../../shared/services/price-review.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PriceReviewRoutingModule,
    InputTextareaModule
  ],
  declarations: [
    PriceReviewSummaryComponent,
    PriceReviewDetailComponent,
    PriceReviewFormComponent,
    PriceReviewEditComponent,
    PriceReviewCreateComponent,
    PriceReviewComponent,
    CommentComponent
  ],
  providers: [
    PriceReviewService
  ]
})
export class PriceReviewModule { }
