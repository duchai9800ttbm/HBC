import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-report-end-interview',
  templateUrl: './report-end-interview.component.html',
  styleUrls: ['./report-end-interview.component.scss']
})
export class ReportEndInterviewComponent implements OnInit {
  @Input() callBack: Function;
  constructor() { }

  ngOnInit() {
  }

  closePopup() {
    this.callBack();
  }
}
