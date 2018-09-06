import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-interview-notice',
  templateUrl: './interview-notice.component.html',
  styleUrls: ['./interview-notice.component.scss']
})
export class InterviewNoticeComponent implements OnInit {
  @Input() callBack: Function;
  constructor() { }

  ngOnInit() {
  }

  closePopup() {
    this.callBack();
  }

}
