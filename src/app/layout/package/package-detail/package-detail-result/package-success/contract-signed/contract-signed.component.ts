import { Component, OnInit } from '@angular/core';
import { DATETIME_PICKER_CONFIG } from '../../../../../../shared/configs/datepicker.config';
import { DATATABLE_CONFIG } from '../../../../../../shared/configs';
import { Observable, BehaviorSubject, Subject } from '../../../../../../../../node_modules/rxjs';
@Component({
  selector: 'app-contract-signed',
  templateUrl: './contract-signed.component.html',
  styleUrls: ['./contract-signed.component.scss']
})
export class ContractSignedComponent implements OnInit {
  datePickerConfig = DATETIME_PICKER_CONFIG;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = DATATABLE_CONFIG;
  checkboxSeclectAll: boolean;
  isDataHsmt:boolean;
  resultData: any = [
    { id: 1, typeData: 'Tài liệu cung cấp vật tư', typeData2: "", namedata: 'Tài liệu cung cấp vật tư', romdata: 'Phòng hành chính', noDate: '20 ngày', interview: 1 },
    {  id: 2, typeData: 'Tài liệu cung cấp vật tư', typeData2: "Cung cấp data", namedata: 'Tài liệu tổng hơp', romdata: 'Phòng lưu trữ', noDate: '50 ngày', interview: 3  }
  ];
  constructor() { }

  ngOnInit() {
    this.isDataHsmt= false;
  }
  onSelectAll(value: boolean) {
    this.resultData.forEach(x => (x['checkboxSelected'] = value));
  }
  showhsmt() {
    this.isDataHsmt =!this.isDataHsmt;

  }
}
