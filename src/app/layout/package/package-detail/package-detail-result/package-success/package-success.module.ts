import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../shared/shared.module';
import { PackageListComponent } from './package-list/package-list.component';
import { ContractSignedComponent } from './contract-signed/contract-signed.component';
import { MeetingKickoffComponent } from './meeting-kickoff/meeting-kickoff.component';
import { PackageSuccessRoutingModule } from './package-success-routing.module';
import { PackageSuccessComponent } from './package-success.component';
import { CKEditorModule } from 'ng2-ckeditor';
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
        MeetingKickoffComponent,
        PackageSuccessComponent
    ]
})
export class PackageSuccessModule { }
