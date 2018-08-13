import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { GridDataResult, PageChangeEvent, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { GroupUserService } from '../../../../../shared/services/group-user.service';
import { ListUserItem } from '../../../../../shared/models/user/user-list-item.model';
import { AlertService } from '../../../../../shared/services';
import { PagedResult } from '../../../../../shared/models/paging-result.model';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from '../../../../../../../node_modules/rxjs';
import 'rxjs/add/operator/map';
import { DictionaryItem } from '../../../../../shared/models';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {
  searchTerm$ = new BehaviorSubject<string>('');
  gridLoading = true;
  listUserItem: ListUserItem;
  userId: number;
  isActive: boolean;
  pagedResult: PagedResult<any> = new PagedResult<any>();
  public gridView: GridDataResult;
  items: PagedResult<ListUserItem>;
  public mySelection: number[] = [];
  public pageSize = 10;
  public skip = 0;
  total: any;
  modalRef: BsModalRef;
  userName: string;
  form: FormGroup;
  isCheckbox = false;
  checkboxValue = false;
  public selectAllState: SelectAllCheckboxState = 'unchecked';
  dataGroupUser: DictionaryItem[];
  groups: Array<{ name: string; id: number }> = [
    { id: 45, name: 'Admin' },
    { id: 50, name: 'Nhân viên kinh doanh' }
  ];
  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private groupUserService: GroupUserService,
    private modalService: BsModalService) {

  }

  ngOnInit() {
    this.refresh(0, 10);
    // this.form = this.formBuilder.group({
    //   id: ['', Validators.required],
    // });

    this.groupUserService
      .searchKeyWord(this.searchTerm$, 0, 10)
      .subscribe(result => {
        console.log('result', result);
        this.rerender(result);
      }, err => {
      });
  }

  rerender(pagedResult: any) {
    this.pagedResult = pagedResult;
  }

  loadPage() {
    this.refresh(0, 10);
  }

  pagedResultChange(pagedResult: any) {
    this.refresh(pagedResult.currentPage, pagedResult.pageSize);
  }

  refresh(page: string | number, pageSize: string | number) {
    this.gridLoading = true;
    this.groupUserService.getdataGroupUser(page, pageSize).subscribe(data => {
      this.pagedResult = data;
      this.gridLoading = false;
    });
  }

  openModalDeactive(id: number, isActive: boolean, template: TemplateRef<any>) {
    this.userId = id;
    this.isActive = isActive;
    this.groupUserService.getListAccounts(id).subscribe(data => {
      this.userName = data.userName;
    });

    this.modalRef = this.modalService.show(template);
  }
  onDeactiveUserGroup(id: number, isActive: boolean) {
    this.groupUserService.activeOrDeactiveUser(id, isActive)
      .subscribe(data => {
        this.alertService.success('Cập nhật thành công!');
        this.refresh(0, this.pagedResult.pageSize);
      });

    this.modalRef.hide();
  }


  submit() {
    console.log('this.Edit.value', this.isCheckbox);
  }

  showPopupSelect(idUser: number, template: TemplateRef<any>) {
    this.groupUserService.getListAllGroupUser().subscribe(element => {
      this.dataGroupUser = element.map(i => {
        return {
          id: i.id,
          text: i.name,
        };
      });
      this.modalRef = this.modalService.show(template);
    });
  }
}
