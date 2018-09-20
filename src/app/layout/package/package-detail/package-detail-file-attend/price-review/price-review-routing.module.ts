import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PriceReviewSummaryComponent } from './price-review-summary/price-review-summary.component';
import { PriceReviewCreateComponent } from './price-review-create/price-review-create.component';
import { PriceReviewEditComponent } from './price-review-edit/price-review-edit.component';
import { PriceReviewDetailComponent } from './price-review-detail/price-review-detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'summary' },
  { path: 'summary', pathMatch: 'full', component: PriceReviewSummaryComponent },
  { path: 'create', component: PriceReviewCreateComponent },
  { path: 'edit', component: PriceReviewEditComponent },
  { path: 'detail', component: PriceReviewDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PriceReviewRoutingModule { }
