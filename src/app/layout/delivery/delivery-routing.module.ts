import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeliveryComponent } from './delivery.component';

const routes: Routes = [
    {
        path: 'detail/:id',
        component: DeliveryComponent
    },
    {
        path: 'detail/:id/:invoiceNo',
        component: DeliveryComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DeliveryRoutingModule {}
