import { Component, OnInit } from '@angular/core';
import { DATETIME_PICKER_CONFIG } from '../../../../../../shared/configs/datepicker.config';
import { DATATABLE_CONFIG } from '../../../../../../shared/configs';
import { Observable, BehaviorSubject, Subject } from '../../../../../../../../node_modules/rxjs';
import { DocumentItem } from '../../../../../../shared/models/document-item';
import { PackageSuccessService } from '../../../../../../shared/services/package-success.service';

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
  isDataHsmt: boolean;
  isDataHsdt: boolean;
  public resultData: DocumentItem[] = this.packageSuccessService.getdataDocuments(); 
  
  constructor(private packageSuccessService: PackageSuccessService) { }

  ngOnInit() {
    this.isDataHsmt = false;
    this.isDataHsdt = false;
    console.log('resultData',this.resultData);
  }
  onSelectAll(value: boolean) {
    this.resultData.forEach(x => (x['checkboxSelected'] = value));
  }
  showhsmt() {
    this.isDataHsmt = !this.isDataHsmt;

  }
  showhsdt() {
    this.isDataHsdt = !this.isDataHsdt;
  }
}
