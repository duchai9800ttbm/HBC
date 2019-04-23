import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { PackageDetailFileInvitationRoutingModule } from './package-detail-file-invitation-routing.module';
import { PackageDetailFileInvitationComponent } from './package-detail-file-invitation.component';
import { AddFileComponent } from './add-file/add-file.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { UploadFileComponent } from './add-file/upload-file/upload-file.component';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { TagInputModule } from 'ngx-chips';
import { FullFileComponent } from './full-file/full-file.component';
import { DetailUploadFileComponent } from './add-file/detail-upload-file/detail-upload-file.component';
TagInputModule.withDefaults({
  tagInput: {
    placeholder: 'Nhập địa chỉ email',
    // add here other default values for tag-input
  },
  dropdown: {
    displayBy: 'my-display-value',
    // add here other default values for tag-input-dropdown
  }
});
@NgModule({
  imports: [
    TagInputModule,
    CommonModule,
    SharedModule,
    CKEditorModule,
    FilterPipeModule,
    PackageDetailFileInvitationRoutingModule
  ],
  declarations: [
    PackageDetailFileInvitationComponent,
    FullFileComponent,
    AddFileComponent,
    UploadFileComponent,
    DetailUploadFileComponent
  ]
})
export class PackageDetailFileInvitationModule { }
