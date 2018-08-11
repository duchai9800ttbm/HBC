import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PackageDetailResultComponent } from './package-detail-result.component';
import { WaitResultComponent } from './wait-result/wait-result.component';
import { PackageFailedComponent } from './package-failed/package-failed.component';
const routes: Routes = [
    {
        path: '',
        component: PackageDetailResultComponent,
        children: [
            { path: '', redirectTo: 'wait-result' },
            { path: 'wait-result', component: WaitResultComponent },
            { path: 'package-failed', component: PackageFailedComponent },
            { path: 'package-success', loadChildren: './package-success/package-success.module#PackageSuccessModule' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PackageDetailResultRoutingModule { }
