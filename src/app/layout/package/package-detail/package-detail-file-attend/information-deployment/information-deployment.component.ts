import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { PackageDetailComponent } from '../../package-detail.component';
import { DATETIME_PICKER_CONFIG } from '../../../../../shared/configs/datepicker.config';
import { UploadItem } from '../../../../../shared/models/upload/upload-item.model';
import { from } from 'rxjs/observable/from';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GridDataResult, PageChangeEvent, } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';


@Component({
  selector: 'app-information-deployment',
  templateUrl: './information-deployment.component.html',
  styleUrls: ['./information-deployment.component.scss']
})
export class InformationDeploymentComponent implements OnInit {
  public gridView: GridDataResult;
  public items: any[] = listUsers;
  public mySelection: number[] = [];

  formUpload: FormGroup;
  submitted = false;
  private dataUploadFile: UploadItem[] = [];
  uploadItem: UploadItem[];
  modalRef: BsModalRef;
  modalViewListData: BsModalRef;
  modelSendAssignment: BsModalRef;
  modelUp: BsModalRef;
  currentPackageId: number;
  textInformation: string;
  toggleTextUpFile: string;
  isTeamPlate: boolean;
  isSendInformation: boolean;
  showTabelAssignment: boolean;
  hideButon: boolean;
  showButtonAssignmet: boolean;
  isconfirmProgress: boolean;
  textConfirmProgress: string;
  setHSDT: boolean;
  dataConfirm = true;
  ckeditorContent: string = '<p>Dear All!</p>';
  datePickerConfig = DATETIME_PICKER_CONFIG;
  public skip = 0;
  pageSize = 5;
  roms: Array<{ name: string; id: number }> = [
    { id: 1, name: 'Sales' },
    { id: 2, name: 'Master' }
  ];
  listUsers: Array<{ name: string; id: number }> = [
    { id: 1, name: 'Oliver Dinh' },
    { id: 2, name: 'Phuong VD' },
    { id: 3, name: 'Nghia Nguyen' },
    { id: 4, name: 'Dao Nhan' },
    { id: 5, name: 'Dang Quyen' }
  ];
  constructor(private modalService: BsModalService, private formBuilder: FormBuilder) {
    this.loadItems();
  }

  ngOnInit() {

    this.formUpload = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      createDate: [''],
      userId: [null],
      version: [''],
    });
    this.setHSDT = false;
    this.isTeamPlate = false;
    this.isconfirmProgress = false;
    this.hideButon = false;
    this.isSendInformation = false;
    this.showTabelAssignment = false;
    this.showButtonAssignmet = false;
    this.textConfirmProgress = 'Gửi phân công tiến độ';
    this.toggleTextUpFile = 'Bạn cần phải thông báo triển khai trước khi phân công tiến độ';
    this.textInformation = 'Chưa thông báo triển khai';
    this.currentPackageId = +PackageDetailComponent.packageId;

  }
  openModalDeployment(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }
  openModalUpload(template: TemplateRef<any>) {
    this.modelUp = this.modalService.show(template);
  }
  openModeSendAssignment(template: TemplateRef<any>) {
    this.modelSendAssignment = this.modalService.show(template);
  }
  openModelViewListData(template: TemplateRef<any>) {
    this.modalViewListData = this.modalService.show(template);
  }
  SendInformation() {
    this.isSendInformation = !this.isSendInformation;
    this.isTeamPlate = !this.isTeamPlate;
    this.textInformation = 'Đã thông báo triển khai';
    this.toggleTextUpFile = this.isSendInformation ? 'Chưa có tài liệu phân công tiến độ. Vui lòng upload file'
      : 'Bạn cần phải thông báo triển khai trước khi phân công tiến độ';
    this.modalRef.hide();
  }

  get f() { return this.formUpload.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.formUpload.invalid) {
      return;
    }

    this.dataUploadFile.unshift({
      id: this.dataUploadFile.length + 1,
      name: this.formUpload.value.name,
      description: this.formUpload.value.description,
      createDate: '',
      status: null,
      userId: null,
      version: this.formUpload.value.version
    });
    this.uploadItem = this.dataUploadFile;
    this.formUpload.reset();
    this.submitted = false;
    // this.isSendInformation = false;
    this.showTabelAssignment = !this.showTabelAssignment;
    this.showButtonAssignmet = !this.showButtonAssignmet;
    this.modelUp.hide();

  }

  confirmProgress() {
    this.isconfirmProgress = !this.isconfirmProgress;
    this.showButtonAssignmet = !this.showButtonAssignmet;
    this.hideButon = !this.hideButon;
    this.isTeamPlate = false;
    this.dataConfirm = !this.dataConfirm;
    this.textInformation = 'Đã xác nhận phân công';
  }
  sendConfirmAssignment() {
    this.setHSDT = true;
    this.modelSendAssignment.hide();
    this.textConfirmProgress = 'Gửi lại phân công tiến độ';
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.loadItems();
  }

  private loadItems(): void {
    this.gridView = {
      data: this.items.slice(this.skip, this.skip + this.pageSize),
      total: this.items.length
    };
  }

}
const listUsers = [
  {
    id: 1,
    name: 'Ngoc Dang',
    rom: 'Sales',
    email: 'ngocdang@gmail.com',
    checkbox: true
  },
  {
    id: 2,
    name: 'Oliver Dinh',
    rom: 'Sales',
    email: 'oliverdinh@gmail.com',
    checkbox: true
  },
  {
    id: 3,
    name: 'Phuong VD',
    rom: 'Sales',
    email: 'phuongvd@gmail.com',
    checkbox: true
  }
];
