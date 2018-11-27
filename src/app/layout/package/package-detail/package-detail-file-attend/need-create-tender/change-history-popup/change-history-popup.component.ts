import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-change-history-popup',
  templateUrl: './change-history-popup.component.html',
  styleUrls: ['./change-history-popup.component.scss']
})
export class ChangeHistoryPopupComponent implements OnInit {
  @Input() updateInfo;
  @Input() index;
  @Output() closed = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
  }
  closePopup() {
    this.closed.emit(true);
  }

}
