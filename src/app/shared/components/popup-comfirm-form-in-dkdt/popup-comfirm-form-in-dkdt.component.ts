import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-popup-comfirm-form-in-dkdt',
  templateUrl: './popup-comfirm-form-in-dkdt.component.html',
  styleUrls: ['./popup-comfirm-form-in-dkdt.component.scss']
})
export class PopupComfirmFormInDkdtComponent implements OnInit {


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
