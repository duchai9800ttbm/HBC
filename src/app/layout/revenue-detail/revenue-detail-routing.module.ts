import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RevenueDetailComponent } from './revenue-detail.component';

const routes: Routes = [
    {
        path: 'detail/:id',
        component: RevenueDetailComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RevenueDetailRoutingModule {}
