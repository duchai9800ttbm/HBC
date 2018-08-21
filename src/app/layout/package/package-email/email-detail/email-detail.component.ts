import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-email-detail',
  templateUrl: './email-detail.component.html',
  styleUrls: ['./email-detail.component.scss']
})
export class EmailDetailComponent implements OnInit {

  @Input() emailId: number;

  constructor() { }

  ngOnInit() {
  }

}
