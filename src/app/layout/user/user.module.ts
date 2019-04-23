import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from '../user/user.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { UserService } from '../../shared/services/index';
import { ImageCropperModule } from 'ngx-image-cropper';
import { UserAvatarModalComponent } from './user-profile/user-avatar-modal/user-avatar-modal.component';
@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    ImageCropperModule
  ],
  entryComponents: [
    UserAvatarModalComponent
  ],
  declarations: [UserComponent, UserProfileComponent, UserAvatarModalComponent],
  providers: [UserService]
})
export class UserModule { }
