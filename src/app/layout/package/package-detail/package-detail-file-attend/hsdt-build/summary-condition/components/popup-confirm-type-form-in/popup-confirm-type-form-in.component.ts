import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-popup-confirm-type-form-in',
  templateUrl: './popup-confirm-type-form-in.component.html',
  styleUrls: ['./popup-confirm-type-form-in.component.scss']
})
export class PopupConfirmTypeFormInComponent implements OnInit {

  @Output() closed = new EventEmitter<string>();
  typeFormInTomTatDK = 'HSMT';
  descriptionUpdate: string;
  constructor(
  ) { }

  ngOnInit() {
    document.addEventListener('keyup', e => {
      if (e.keyCode === 27) { this.closed.emit(null); }
    });
  }

  close() {
    this.closed.emit(null);
  }

  submit() {
     this.closed.emit(this.typeFormInTomTatDK);
  }

}

export class TypeFormInTomTatDK {
  type?: string;
}
