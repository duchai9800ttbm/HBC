import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-validation-summary',
  templateUrl: './validation-summary.component.html',
  styleUrls: ['./validation-summary.component.scss']
})
export class ValidationSummaryComponent implements OnInit {

  @Input() validationMessages: string[];
  constructor() { }

  ngOnInit() {
  }

}
