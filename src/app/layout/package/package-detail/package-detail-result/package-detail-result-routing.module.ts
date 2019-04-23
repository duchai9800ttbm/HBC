import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PackageDetailResultComponent } from './package-detail-result.component';
import { WaitResultComponent } from './wait-result/wait-result.component';
import { PackageFailedComponent } from './package-failed/package-failed.component';
import { PackgeCancelComponent } from './packge-cancel/packge-cancel.component';
const routes: Routes = [
    {
        path: '',
        component: PackageDetailResultComponent,
        children: [
            // { path: '', redirectTo: 'wait-result' },
            { path: 'wait-result', component: WaitResultComponent },
            { path: 'package-failed', component: PackageFailedComponent },
            { path: 'package-success', loadChildren: './package-success/package-success.module#PackageSuccessModule' },
            { path: 'package-cancel', component: PackgeCancelComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PackageDetailResultRoutingModule { }
