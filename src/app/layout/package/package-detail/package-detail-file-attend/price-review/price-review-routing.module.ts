import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PriceReviewSummaryComponent } from './price-review-summary/price-review-summary.component';
import { PriceReviewCreateComponent } from './price-review-create/price-review-create.component';
import { PriceReviewEditComponent } from './price-review-edit/price-review-edit.component';
import { PriceReviewDetailComponent } from './price-review-detail/price-review-detail.component';
import { FormPreparationGuard } from '../../../../../shared/services/form-preparation.guard.service';
import { FormPricePrivewEditGuard, FormPricePrivewCreateGuard } from '../../../../../shared/services/form-price-preview.guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'summary' },
  { path: 'summary', component: PriceReviewSummaryComponent },
  {
    path: 'create',
    component: PriceReviewCreateComponent,
    canActivate: [FormPricePrivewCreateGuard]
  },
  {
    path: 'edit',
    component: PriceReviewEditComponent,
    canActivate: [FormPricePrivewEditGuard]
  },
  { path: 'detail', component: PriceReviewDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    FormPricePrivewEditGuard,
    FormPricePrivewCreateGuard
  ]
})
export class PriceReviewRoutingModule { }
