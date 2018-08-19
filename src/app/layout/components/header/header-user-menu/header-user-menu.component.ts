import { Component, OnInit } from '@angular/core';
import { SessionService, ConfirmationService, UserService } from '../../../../shared/services/index';
import { UserModel } from '../../../../shared/models/user/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangePasswordModalComponent } from '../../change-password-modal/change-password-modal.component';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { Router } from '../../../../../../node_modules/@angular/router';
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
    private confirmationService: ConfirmationService,
    private router: Router,
    private userService: UserService
  ) { }

  avatarSrc: string;
  ngOnInit() {
    this.avatarSrc = this.sessionService.userInfo.avatar ? this.sessionService.userInfo.avatar : defaultAvatarSrc;
    this.userInfo = this.sessionService.userInfo;
    console.log('header', this.userInfo);
    const that = this;
    this.sessionService.getUserInfo().subscribe(user => {
      this.userInfo = user;
      this.avatarSrc =  user.avatar ? user.avatar : defaultAvatarSrc;
    });
    this.sessionService.watchAvatarUser().subscribe(user => {
      this.avatarSrc =  user.avatar ? user.avatar : defaultAvatarSrc;
    });
  }

  onLoggedout() {
    this.confirmationService.confirm(
      'Bạn có chắc chắn muốn đăng xuất?',
      () => {
        this.sessionService.destroySession();
        this.router.navigate(['/login']);
      }
    );
  }

  openChangePasswordModal() {
    const modalRef = this.modalService.open(ChangePasswordModalComponent);

  }
}
