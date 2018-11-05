import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-view-detail',
  templateUrl: './view-detail.component.html',
  styleUrls: ['./view-detail.component.scss']
})
export class ViewDetailComponent implements OnInit {
  @Input() callBack: Function;
  @Input() content;
  constructor() { }

  ngOnInit() {
    console.log('item', this.content);
  }

  close() {
    this.callBack();
  }

}
