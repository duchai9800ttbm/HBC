import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { HoSoDuThauService } from '../../../../../../../../shared/services/ho-so-du-thau.service';

@Component({
  selector: 'app-popup-update-description',
  templateUrl: './popup-update-description.component.html',
  styleUrls: ['./popup-update-description.component.scss']
})
export class PopupUpdateDescriptionComponent implements OnInit {
  @Output() closed = new EventEmitter<boolean>();
  descriptionUpdate: string;
  constructor(
    private hoSoDuThauService: HoSoDuThauService
  ) { }

  ngOnInit() {
    document.addEventListener('keyup', e => {
      if (e.keyCode === 27) { this.closed.emit(false); }
    });
  }
  close() {
    this.closed.emit(false);
  }
  submit() {
    this.mappingToLiveFormData();
    this.closed.emit(true);
  }
  mappingToLiveFormData() {
    this.hoSoDuThauService.emitDataUpdateDescription(this.descriptionUpdate);
  }
}
