import { NgModule } from '../../../../../node_modules/@angular/core';
import { Routes, RouterModule } from '../../../../../node_modules/@angular/router';
import { PackageDetailInfoComponent } from './package-detail-info/package-detail-info.component';
import { PackageDetailComponent } from './package-detail.component';
import { PackageDetailFileInvitationComponent } from './package-detail-file-invitation/package-detail-file-invitation.component';
import { PackageDetailResultComponent } from './package-detail-result/package-detail-result.component';
import { PackageEdit2Component } from './package-edit-2/package-edit-2.component';
import { InformationComponent } from './package-detail-info/information/information.component';
import { InformationDeploymentComponent} from './package-detail-file-attend/information-deployment/information-deployment.component';
const routes: Routes = [
    {
        path: '',
        component: PackageDetailComponent,
        children: [
            { path: '', redirectTo: 'info' },
            {
                path: 'info',
                loadChildren: './package-detail-info/package-detail-info.module#PackageDetailInfoModule'
                // component: InformationComponent
            },
            {
                path: 'attend',
                loadChildren: './package-detail-file-attend/package-detail-file-attend.module#PackageDetailFileAttendModule'
            },
            // { path: 'edit', component: PackageEdit2Component },
            {
                path: 'invitation',
                loadChildren: './package-detail-file-invitation/package-detail-file-invitation.module#PackageDetailFileInvitationModule'
            },
            // {
            //     path: 'invitation',
            //     loadChildren: './package-detail-file-invitation/package-detail-file-invitation.module#PackageDetailFileInvitationModule'
            // },
            {   path: 'result',
                loadChildren: './package-detail-result/package-detail-result.module#PackageDetailResultModule'
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PackageDetailRoutingModule {
}
