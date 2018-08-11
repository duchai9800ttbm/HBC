import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService, SessionService } from '../../../../shared/services/index';

@Component({
  selector: 'app-contact-avatar',
  templateUrl: './contact-avatar.component.html',
  styleUrls: ['./contact-avatar.component.scss']
})
export class ContactAvatarComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  constructor(
    public activeModal: NgbActiveModal,
    private alertService: AlertService,
    private sessionService: SessionService
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
    this.sessionService.saveAvatarContact(imageBase64);
    this.activeModal.close();
  }
}
