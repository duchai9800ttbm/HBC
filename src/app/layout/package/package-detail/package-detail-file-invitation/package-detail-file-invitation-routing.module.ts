import { Routes, RouterModule } from '../../../../../../node_modules/@angular/router';
import { NgModule } from '../../../../../../node_modules/@angular/core';
import { PackageDetailFileInvitationComponent } from './package-detail-file-invitation.component';
import { AddFileComponent } from './add-file/add-file.component';
import { FullFileComponent } from './full-file/full-file.component';

const routes: Routes = [
    {
        path: '',
        component: PackageDetailFileInvitationComponent,
        children: [
            { path: '', redirectTo: 'add-file' },
            { path: 'add-file', component: AddFileComponent },
            { path: 'full-file', component: FullFileComponent },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PackageDetailFileInvitationRoutingModule {
}
