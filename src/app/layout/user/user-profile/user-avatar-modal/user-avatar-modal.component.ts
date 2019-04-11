import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService, SessionService, AlertService } from '../../../../shared/services/index';
import Utils from '../../../../shared/helpers/utils.helper';

@Component({
  selector: 'app-user-avatar-modal',
  templateUrl: './user-avatar-modal.component.html',
  styleUrls: ['./user-avatar-modal.component.scss']
})
export class UserAvatarModalComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  errorMess: string;
  constructor(
    public activeModal: NgbActiveModal,
    private userService: UserService,
    private sessionService: SessionService,
    private alertService: AlertService,

  ) { }

  ngOnInit() {
  }


  fileChangeEvent(event: any): void {
    console.log('event.target.files;', event.target.files);
    if (Utils.checkTypeFileImage(event.target.files)) {
      this.errorMess = null;
      this.imageChangedEvent = event;
    } else {
      this.errorMess = 'Hệ thống không hỗ trợ upload loại file này. Những loại file được hỗ trợ bao gồm jpg, .jpeg';
    }
  }
  imageCropped(image: string) {
    this.croppedImage = image;
  }

  saveImage() {
    const imageBase64 = this.croppedImage.split(',')[1];
    const imageFile = fetch(this.croppedImage).then(res => res.blob()).then(blob => {
      const file = new File([blob], 'avatar');
      this.userService.upLoadAvatar(file).subscribe(res => {
        this.sessionService.saveAvatarUser(res);
        this.activeModal.close();
        this.alertService.success('Cập nhật ảnh đại diện thành công!');
      });
    });

  }

}
