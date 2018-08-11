import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../../shared/services/index';
import { UserModel } from '../../../../shared/models/user/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangePasswordModalComponent } from '../../change-password-modal/change-password-modal.component';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
const defaultAvatarSrc = 'assets/images/no-avatar.png';
@Component({
  selector: 'app-header-user-menu',
  templateUrl: './header-user-menu.component.html',
  styleUrls: ['./header-user-menu.component.scss']
})
export class HeaderUserMenuComponent implements OnInit {
  userInfo: UserModel;
  constructor(
    private sessionService: SessionService,
    private modalService: NgbModal,
  ) { }

  avatarSrc: string;
  ngOnInit() {
    this.avatarSrc = this.sessionService.userInfo.avatarUrl ? `data:image/jpeg;base64,${this.sessionService.userInfo.avatarUrl}`
     : defaultAvatarSrc;
 //   this.userInfo = this.sessionService.userInfo;
    const that = this;
    // this.sessionService
    //   .getUserInfo()
    //   .subscribe(user => {
    //     that.userInfo = user;
    //     that.avatarSrc = user.avatar ? `data:image/jpeg;base64,${user.avatar}` : defaultAvatarSrc;
    //   }
    //   );
  }

  onLoggedout() {
    this.sessionService.destroySession();
  }

  openChangePasswordModal() {
    const modalRef = this.modalService.open(ChangePasswordModalComponent);

  }
}
