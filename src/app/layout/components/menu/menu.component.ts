import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionService } from '../../../shared/services';
import { ChangePasswordModalComponent } from '../change-password-modal/change-password-modal.component';
import { UserModel } from '../../../shared/models/user/user.model';
const defaultAvatarSrc = 'assets/images/no-avatar.png';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  userInfo: UserModel;

  constructor(
    private sessionService: SessionService,
    private modalService: NgbModal, ) { }
  avatarSrc: string;

  ngOnInit() {
    this.avatarSrc = this.sessionService.userInfo.avatarUrl ? `data:image/jpeg;base64,${this.sessionService.userInfo.avatarUrl}`
    : defaultAvatarSrc;
   this.userInfo = this.sessionService.userInfo;
   const that = this;
   this.sessionService
     .getUserInfo()
     .subscribe(user => {
       that.userInfo = user;
       that.avatarSrc = user.avatarUrl ? `data:image/jpeg;base64,${user.avatarUrl}` : defaultAvatarSrc;
     }
     );
  }


  onLoggedout() {
    this.sessionService.destroySession();
  }

  openChangePasswordModal() {
    const modalRef = this.modalService.open(ChangePasswordModalComponent);
  }
}
