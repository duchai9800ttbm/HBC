import { Component, OnInit,TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DATATABLE_CONFIG } from '../../../../../shared/configs';
import { Observable, BehaviorSubject, Subject } from '../../../../../../../node_modules/rxjs';
import { PackageDetailComponent } from '../../package-detail.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-package-failed',
  templateUrl: './package-failed.component.html',
  styleUrls: ['./package-failed.component.scss']
})
export class PackageFailedComponent implements OnInit {
  packageId: number;
  modalRef: BsModalRef;
  modalViewData:BsModalRef;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = DATATABLE_CONFIG;
  checkboxSeclectAll: boolean;
  ckeditorContent: string = '<p>Dear All!</p>';
  isSendCc:boolean;
  isSendBcc:boolean;
  textHeader:string;
  textNotification:string;
  showBtnNotification:boolean;
  bidDocumentReviewListItemSearchResult: any = [
    { id: 1, bidReviewDocumentName: 'Tài liệu cung cấp vật tư', bidReviewDocumentVersion: 1, bidReviewDocumentStatus: 'Danh sách tài liệu cung cấp vật tư', employeeName: 'Oliver Dinh', bidReviewDocumentUploadDate: '01/01/2018 ,09:00', interview: 1 },
    { id: 2, bidReviewDocumentName: 'Tài liệu cung cấp giấy tờ liên quan', bidReviewDocumentVersion: 1.1, bidReviewDocumentStatus: '', employeeName: 'Van Dinh', bidReviewDocumentUploadDate: '02/02/2018,09:00', interview: 1 }
  ];
  listData : any =[
    { id:1, username:'Oliver Dinh',email:'oliverdinh@gmail.com'},
    { id:2, username:'Van Dinh',email:'vandinh@gmail.com'},
    { id:3, username:'Huy Nhat',email:'huynhat@gmail.com'}
  ]
  constructor(
    private modalService: BsModalService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.packageId = +PackageDetailComponent.packageId;
    this.isSendCc = false;
    this.isSendBcc = false;
    this.showBtnNotification= false;
    this.textHeader ="Trật thầu";
    this.textNotification ="Thông báo các bên liên quan";
  }
  onSelectAll(value: boolean) {
    this.bidDocumentReviewListItemSearchResult.forEach(x => (x['checkboxSelected'] = value));
  }
  
  modelViewListData (template: TemplateRef<any>) {
    this.modalViewData = this.modalService.show(template);
  }
  openModalNotification(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg-max' })
    );
  }
  sendCc(){
    this.isSendCc =!this.isSendCc;
  }
  sendBcc(){
    this.isSendBcc =!this.isSendBcc;
  }
  SendMail(){
    this.modalRef.hide();
    this.showBtnNotification =true;
    this.textHeader = this.showBtnNotification ?'Đã thông báo cho các bên liên quan' :'Trật thầu';
    this.textNotification = this.showBtnNotification ?'Thông báo lại cho các bên liên quan' :'Thông báo cho các bên liên quan';

  }
  ClosePopup(){
    this.modalRef.hide();
    this.router.navigate([`/package/detail/${this.packageId}/result`]);
  }
}
