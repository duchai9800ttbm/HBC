import { NgModule } from '../../../../../../node_modules/@angular/core';
import { InformationComponent } from './information/information.component';
import { EditComponent } from './edit/edit.component';
import { Routes, RouterModule } from '../../../../../../node_modules/@angular/router';
import { PackageDetailInfoComponent } from './package-detail-info.component';
const routes: Routes = [
       {
        path: '',
        component: PackageDetailInfoComponent,
        children: [
        { path: '', redirectTo: 'infomation' },
        { path: 'edit', component: EditComponent },
        { path: 'infomation', component: InformationComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PackageDetailInfoRoutingModule {
}
