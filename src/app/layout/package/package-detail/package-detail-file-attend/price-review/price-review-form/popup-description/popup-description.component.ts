import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-popup-description',
  templateUrl: './popup-description.component.html',
  styleUrls: ['./popup-description.component.scss']
})
export class PopupDescriptionComponent implements OnInit {
  @Output() closed = new EventEmitter();
  descriptionUpdate: string;
  constructor() { }

  ngOnInit() {
    document.addEventListener('keyup', e => {
      if (e.keyCode === 27) { this.closed.emit(false); }
    });
  }
  close() {
    this.closed.emit(false);
  }
  submit() {
    this.closed.emit(this.descriptionUpdate);
  }
}
