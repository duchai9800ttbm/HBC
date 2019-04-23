import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../shared/shared.module';
import { PackageListComponent } from './package-list/package-list.component';
import { ContractSignedComponent } from './contract-signed/contract-signed.component';
// import { MeetingKickoffComponent } from './meeting-kickoff/meeting-kickoff.component';
import { PackageSuccessRoutingModule } from './package-success-routing.module';
import { PackageSuccessComponent } from './package-success.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { PackageDocumentComponent } from './package-list/package-document/package-document.component';
import { PackageDocumentSenderComponent } from './package-list/package-document/package-document-sender/package-document-sender.component';
// tslint:disable-next-line:max-line-length
import { PackageDocumentReceiverComponent } from './package-list/package-document/package-document-receiver/package-document-receiver.component';
// import { ReportMeetingComponent } from './meeting-kickoff/report-meeting/report-meeting.component';
@NgModule({
    imports: [
        CommonModule,
        PackageSuccessRoutingModule,
        SharedModule,
        CKEditorModule
    ],
    declarations: [
        PackageListComponent,
        ContractSignedComponent,
        // MeetingKickoffComponent,
        PackageSuccessComponent,
        PackageDocumentComponent,
        PackageDocumentSenderComponent,
        PackageDocumentReceiverComponent,
        // ReportMeetingComponent
    ]
})
export class PackageSuccessModule { }
