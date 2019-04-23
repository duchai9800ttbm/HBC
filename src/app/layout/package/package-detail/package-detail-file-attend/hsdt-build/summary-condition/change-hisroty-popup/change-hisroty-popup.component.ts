import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-change-hisroty-popup',
  templateUrl: './change-hisroty-popup.component.html',
  styleUrls: ['./change-hisroty-popup.component.scss']
})
export class ChangeHisrotyPopupComponent implements OnInit {
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
