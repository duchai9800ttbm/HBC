import { Routes, RouterModule } from '../../../../../../node_modules/@angular/router';
import { NgModule } from '../../../../../../node_modules/@angular/core';
import { PackageDetailFileInvitationComponent } from './package-detail-file-invitation.component';
import { AddFileComponent } from './add-file/add-file.component';
import { EvaluateComponent } from './evaluate/evaluate.component';
import { SuggestComponent } from './suggest/suggest.component';
import { PendingComponent } from './pending/pending.component';
import { ApprovedComponent } from './approved/approved.component';
import { HasDeclinedComponent } from './has-declined/has-declined.component';
import { RejectionLetterComponent } from './rejection-letter/rejection-letter.component';
import { SendMailRejectComponent } from './send-mail-reject/send-mail-reject.component';
import { FullFileComponent } from './full-file/full-file.component';

const routes: Routes = [
    {
        path: '',
        component: PackageDetailFileInvitationComponent,
        children: [
            { path: '', redirectTo: 'add-file' },
            { path: 'add-file', component: AddFileComponent },
            { path: 'full-file', component: FullFileComponent },
            //   { path: 'evaluate', component: EvaluateComponent },
            //   { path: 'suggest', component: SuggestComponent },
            //   { path: 'pending', component: PendingComponent },
            //   { path: 'approved', component: ApprovedComponent },
            //   { path: 'has-declined', component: HasDeclinedComponent },
            //   { path: 'rejection-letter', component: RejectionLetterComponent },
            //   { path: 'send-mail', component: SendMailRejectComponent },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PackageDetailFileInvitationRoutingModule {
}
