import { Component, OnInit } from '@angular/core';
import { DATETIME_PICKER_CONFIG } from '../../shared/configs/datepicker.config';

@Component({
  selector: 'app-detaild-revenue-window',
  templateUrl: './detaild-revenue-window.component.html',
  styleUrls: ['./detaild-revenue-window.component.scss']
})
export class DetaildRevenueWindowComponent implements OnInit {

  datePickerConfig = DATETIME_PICKER_CONFIG;
  constructor() { }

  ngOnInit() {
  }

}
