import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-update-confirm-popup',
  templateUrl: './update-confirm-popup.component.html',
  styleUrls: ['./update-confirm-popup.component.scss']
})
export class UpdateConfirmPopupComponent implements OnInit {
  @Output() closed = new EventEmitter<boolean>();
  public close() {
    this.closed.emit(false);
  }
  constructor() { }

  ngOnInit() {
    document.addEventListener('keyup', e => {
      if (e.keyCode === 27) { this.closed.emit(false); }
    });
  }
  submit() {
    this.closed.emit(true);
  }
}
