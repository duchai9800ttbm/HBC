import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DATETIME_PICKER_CONFIG } from '../../../../../../shared/configs/datepicker.config';
@Component({
  selector: 'app-create-new-invitation',
  templateUrl: './create-new-invitation.component.html',
  styleUrls: ['./create-new-invitation.component.scss']
})
export class CreateNewInvitationComponent implements OnInit {
  datePickerConfig = DATETIME_PICKER_CONFIG;
  @Input() callBack: Function;
  constructor() { }

  ngOnInit() {
  }

  closePopup() {
    this.callBack();
  }
}
