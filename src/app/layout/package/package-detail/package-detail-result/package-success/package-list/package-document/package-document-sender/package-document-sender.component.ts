import { Component, OnInit ,TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DATETIME_PICKER_CONFIG } from '../../../../../../../../shared/configs/datepicker.config';
import { DATATABLE_CONFIG } from '../../../../../../../../shared/configs';
import { Observable, BehaviorSubject, Subject } from '../../../../../../../../../../node_modules/rxjs';
import { DocumentItem } from '../../../../../../../../shared/models/document-item';
import { PackageSuccessService } from '../../../../../../../../shared/services/package-success.service';
import { SessionService } from '../../../../../../../../shared/services/index';
import { Router } from '@angular/router';

@Component({
  selector: 'app-package-document-sender',
  templateUrl: './package-document-sender.component.html',
  styleUrls: ['./package-document-sender.component.scss']
})
export class PackageDocumentSenderComponent implements OnInit {
  datePickerConfig = DATETIME_PICKER_CONFIG;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = DATATABLE_CONFIG;
  checkboxSeclectAll: boolean;
  seclectAllDocument:boolean;
  isDataHsmt: boolean;
  isDataHsdt: boolean;
  total: number;
  textmovedata: string;
  isManageTransfer: boolean; 
  modalRef:BsModalRef;
  userGetDocument:boolean;
  btnManageTransfer:boolean;
  textUserManage:string;
  userInfo:any;
  public data: DocumentItem[] =[];
  listData : any =[
    { id:1,rom:'Maketing', username:'Oliver Dinh',nameDocument:'Maketing online', status: 'Đã nhận'},
    { id:2, rom:'Maketing', username:'Van Dinh',nameDocument:'Maketing online',status: 'Đã nhận'},
    { id:3,rom:'Maketing-slide', username:'Huy Nhat',nameDocument:'Maketing online',status: 'Yêu cầu gửi lại'},
    { id:4,rom:'Sale', username:'Phuong VD',nameDocument:'Maketing online',status: 'Chưa nhận'},
    { id:5, rom:'Maketing', username:'Nghia Nguyen',nameDocument:'Maketing online',status: 'Đã nhận'},
    { id:6,rom:'Maketing-slide', username:'Dao Nhan',nameDocument:'Maketing online',status: 'Yêu cầu gửi lại'}
  ]
  // public data :DocumentItem [] = this.packageSuccessService.getdataGetDocument();

  constructor(
    private packageSuccessService: PackageSuccessService,  
    private modalService: BsModalService,
    private sessionService: SessionService,
    private router:Router
  ) { }

  ngOnInit() {
    
    this.userInfo = this.sessionService.userInfo;
    this.isDataHsmt = false;
    this.isDataHsdt = false;
    this.isManageTransfer = false;
    this.userGetDocument = true;
    this.btnManageTransfer= false;
    this.total = this.data.length;
    this.textmovedata = 'Chưa chuyển giao tài liệu';
    if(this.userGetDocument) {
     this.data = this.packageSuccessService.getdataDocuments();
     this.total = this.data.length;
    }else {
      this.data = this.packageSuccessService.getdataGetDocument();
    }

  }
  onSelectAll(value: boolean) {
    this.data.forEach(x => (x['checkboxSelected'] = value));
  
  }
  onSelectDocument(value: boolean) {
    this.listData.forEach(x => (x['selectedDocument'] = value));
  }
  showhsmt() {
    this.isDataHsmt = !this.isDataHsmt;

  }
  showhsdt() {
    this.isDataHsdt = !this.isDataHsdt;
  }
  transferofdocuments() {
    this.userGetDocument = false;
    this.isManageTransfer = true;
    this.btnManageTransfer = false;
    if(this.userGetDocument) {
      this.textmovedata = this.isManageTransfer ? 'Đã chuyển giao tài liệu':'Chưa chuyển giao tài liệu';
    }else {
      this.textmovedata = 'Chưa nhận tài liệu được chuyển giao';
    }
      
  }
  
 
  manageTransferDocument(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

 
}
