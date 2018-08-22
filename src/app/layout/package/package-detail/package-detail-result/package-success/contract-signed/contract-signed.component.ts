import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DATETIME_PICKER_CONFIG } from '../../../../../../shared/configs/datepicker.config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DATATABLE_CONFIG } from '../../../../../../shared/configs';
import { Observable, BehaviorSubject, Subject } from '../../../../../../../../node_modules/rxjs';

@Component({
  selector: 'app-contract-signed',
  templateUrl: './contract-signed.component.html',
  styleUrls: ['./contract-signed.component.scss']
})
export class ContractSignedComponent implements OnInit {
  @Input() isContract;
  modalUpload: BsModalRef;
  datePickerConfig = DATETIME_PICKER_CONFIG;
  formUpload: FormGroup;
  submitted = false;
  isSignedContract: boolean = false;
  textContract :string;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = DATATABLE_CONFIG;
  resultData: any = [
    { id: 1, documentName: 'Tài liệu cung cấp vật tư', version: 1, description: 'Danh sách tài liệu cung cấp vật tư  ', employeeName: 'Oliver Dinh', createdDate: '01/01/2018 ,09:00',upDate: '01/01/2018', interview: 1 },
    { id: 2, documentName: 'Tài liệu cung cấp giấy tờ liên quan', version: 1.1, description: '', employeeName: 'Van Dinh', createdDate: '02/02/2018,09:00', upDate: '02/02/2018', interview: 1 }
  ];
  constructor(private modalService: BsModalService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    //  this.isContract= false;
    this.formUpload = this.formBuilder.group({
      name: [''],
      link: [''],
      description: [''],
      createDate: [''],
      userId: [null],
      version: [''],
      interview: ['']
    });
    this.textContract ='Đã phản hồi đến phòng hợp đồng';
  }
  modalAdd(template: TemplateRef<any>) {
    this.modalUpload = this.modalService.show(template);
  }
  get f() { return this.formUpload.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.formUpload.invalid) {
      return;
    }
    this.isSignedContract = true;
    this.textContract = this.isSignedContract ? 'Đã ký kết hợp đồng':'Đã phản hồi đến phòng hợp đồng'
    this.modalUpload.hide();

  }
}
