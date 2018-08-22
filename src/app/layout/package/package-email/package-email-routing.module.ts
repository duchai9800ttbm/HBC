import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PackageEmailComponent } from './package-email.component';

const routes: Routes = [
  {
    path: '',
    component: PackageEmailComponent,
    children: [
      { path: '', redirectTo: 'give-up' },
      {
        path: 'give-up',
        loadChildren: './give-up/give-up.module#GiveUpModule'
      },
      {
        path: 'assign',
        loadChildren: './assign/assign.module#AssignModule'
      },
      {
        path: 'deploy',
        loadChildren: './deploy-notice/deploy-notice.module#DeployNoticeModule'
      },
      {
        path: 'interview',
        loadChildren: './interview-notice/interview-notice.module#InterviewNoticeModule'
      },
      {
        path: 'important',
        loadChildren: './important/important.module#ImportantModule'
      },
      {
        path: 'kick-off',
        loadChildren: './kick-off/kick-off.module#KickOffModule'
      },
      {
        path: 'miss',
        loadChildren: './miss-package-notice/miss-package-notice.module#MissPackageNoticeModule'
      },
      {
        path: 'transfer',
        loadChildren: './transfer-document/transfer-document.module#TransferDocumentModule'
      },
      {
        path: 'trash',
        loadChildren: './trash/trash.module#TrashModule'
      },
      {
        path: 'win',
        loadChildren: './win-package-notice/win-package-notice.module#WinPackageNoticeModule'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackageEmailRoutingModule { }
