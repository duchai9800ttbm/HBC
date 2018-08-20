import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PackageEmailRoutingModule } from './package-email-routing.module';
import { GiveUpComponent } from './give-up/give-up.component';
import { AssignComponent } from './assign/assign.component';
import { TransferDocumentComponent } from './transfer-document/transfer-document.component';
import { DeployNoticeComponent } from './deploy-notice/deploy-notice.component';
import { InterviewNoticeComponent } from './interview-notice/interview-notice.component';
import { WinPackageNoticeComponent } from './win-package-notice/win-package-notice.component';
import { MissPackageNoticeComponent } from './miss-package-notice/miss-package-notice.component';
import { KickOffComponent } from './kick-off/kick-off.component';
import { ImportantComponent } from './important/important.component';
import { TrashComponent } from './trash/trash.component';
import { PackageEmailComponent } from './package-email.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    PackageEmailRoutingModule,
    SharedModule,

  ],
  declarations: [
    PackageEmailComponent,
    GiveUpComponent,
    AssignComponent,
    TransferDocumentComponent,
    DeployNoticeComponent,
    InterviewNoticeComponent,
    WinPackageNoticeComponent,
    MissPackageNoticeComponent,
    KickOffComponent,
    ImportantComponent,
    TrashComponent
  ]
})
export class PackageEmailModule { }
