import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService, SessionService, AlertService } from '../../../../shared/services/index';

@Component({
  selector: 'app-user-avatar-modal',
  templateUrl: './user-avatar-modal.component.html',
  styleUrls: ['./user-avatar-modal.component.scss']
})
export class UserAvatarModalComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(
    public activeModal: NgbActiveModal,
    private userService: UserService,
    private sessionService: SessionService,
    private alertService: AlertService,

  ) { }

  ngOnInit() {
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(image: string) {
    this.croppedImage = image;
  }

  saveImage() {
    const imageBase64 = this.croppedImage.split(',')[1];
    this.userService.upLoadAvatar(imageBase64).subscribe(result => {
     // this.sessionService.saveUserInfo(result);
      this.activeModal.close();
      this.alertService.success('Cập nhật ảnh đại diện thành công!');
    });
  }
}
