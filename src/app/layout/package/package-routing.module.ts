import { Routes, RouterModule } from '@angular/router';
import { PackageListComponent } from './package-list/package-list.component';
import { PackageCreateComponent } from './package-create/package-create.component';
import { PackageEditComponent } from './package-edit/package-edit.component';
import { PackageDetailComponent } from './package-detail/package-detail.component';
import { NgModule } from '../../../../node_modules/@angular/core';
const routes: Routes = [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'list', pathMatch: 'full', component: PackageListComponent },
    { path: 'create', component: PackageCreateComponent },
    {
        path: 'detail/:id', loadChildren: './package-detail/package-detail.module#PackageDetailModule',
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PackageRoutingModule {
}
