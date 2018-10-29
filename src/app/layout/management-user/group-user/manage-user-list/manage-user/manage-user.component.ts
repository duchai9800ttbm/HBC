import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { GridDataResult, PageChangeEvent, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { GroupUserService } from '../../../../../shared/services/group-user.service';
import { ListUserItem } from '../../../../../shared/models/user/user-list-item.model';
import { AlertService, ConfirmationService } from '../../../../../shared/services';
import { PagedResult } from '../../../../../shared/models/paging-result.model';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from '../../../../../../../node_modules/rxjs';
import 'rxjs/add/operator/map';
import { DictionaryItem } from '../../../../../shared/models';
import { DATATABLE_CONFIG } from '../../../../../shared/configs';
import { NgxSpinnerService } from '../../../../../../../node_modules/ngx-spinner';
@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {
  loading = false;
  dtOptions: any = DATATABLE_CONFIG;
  dtTrigger: Subject<any> = new Subject();
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
  changeUser;
  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private groupUserService: GroupUserService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
  ) {

  }

  ngOnInit() {
    // this.refresh(0, 10);
    if ( this.groupUserService.getSearchTerm() ) {
      this.searchTerm$ = this.groupUserService.getSearchTerm();
    }
    console.log('this.SearchTerm', this.searchTerm$.value);
    this.loading  = true;
    this.groupUserService
      .searchKeyWord(this.searchTerm$, 0, 10)
      .subscribe(result => {
        this.groupUserService.saveSearchTerm(this.searchTerm$);
        this.rerender(result);
        this.loading  = false;
      }, err => {
        this.loading  = false;
      });
  }

  rerender(pagedResult: any) {
    this.pagedResult = pagedResult;
    this.dtTrigger.next();

  }

  loadPage() {
    // this.refresh(0, 10);
    this.loading  = true;
    this.groupUserService.getdataGroupUser(0, 10).subscribe(data => {
      this.pagedResult = data;
      this.loading  = false;
      this.alertService.success('Dữ liệu được cập nhật mới nhất!');
    },
      err => {
        this.loading  = false;
        this.alertService.error('Đã xảy ra lỗi, dữ liệu không được cập nhật');
      });
  }

  pagedResultChange(pagedResult: any) {
    // this.refresh(pagedResult.currentPage, pagedResult.pageSize);
    this.groupUserService
      .searchKeyWord(this.searchTerm$, pagedResult.currentPage, pagedResult.pageSize)
      .subscribe(result => {
        this.rerender(result);
        this.loading  = false;
      }, err => {
        this.loading  = false;
      });
  }

  refresh(page: string | number, pageSize: string | number) {
    this.loading  = true;
    this.groupUserService.getdataGroupUser(page, pageSize).subscribe(data => {
      this.pagedResult = data;
      this.loading  = false;
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
  }

  showPopupSelect(idUser: number, template: TemplateRef<any>) {
    this.groupUserService.getListAllGroupUser().subscribe(element => {
      this.dataGroupUser = element.map(i => {
        return {
          id: i.id,
          text: i.name,
        };
      });
      this.changeUser = { ...this.pagedResult.items.filter(i => i.id === idUser)[0] };
      if (!this.changeUser.userGroup || !this.changeUser.userGroup.key) {
        this.changeUser.userGroup = {
          key: 0,
          value: '',
        };
      }
      this.modalRef = this.modalService.show(template);
    });
  }

  onSelectAll(value: boolean) {
    this.pagedResult.items.forEach(x => (x.checkboxSelected = value));
  }

  multiDelete() {
    const deleteIds = this.pagedResult.items
      .filter(x => x.checkboxSelected)
      .map(x => x.id);
    if (deleteIds.length === 0) {
      this.alertService.error(
        'Bạn phải chọn ít nhất một đối tượng để xóa!'
      );
    } else {
      this.confirmationService.confirm(
        'Bạn có chắc chắn xóa những người dùng được chọn?',
        () => {
          this.groupUserService.deleteMulti({ ids: deleteIds }).subscribe(response => {
            this.refresh(0, 10);
            this.alertService.success('Xóa người dùng thành công!');
          },
            err => {
              this.alertService.error('Đã xảy ra lỗi! Xóa người dùng không thành công!');
            });
        }
      );
    }
  }

  changeActive(idUser: number, isActive: boolean) {
    this.groupUserService.activeOrDeactiveUser(idUser, isActive).subscribe(response => {
      // this.loading  = true;
      // this.groupUserService.getdataGroupUser(this.pagedResult.currentPage, this.pagedResult.pageSize).subscribe(data => {
      //   this.pagedResult = data;
      //   // this.loading  = false;
      //   this.alertService.success('Thay đổi tình trạng người dùng thành công!');
      // });

      this.groupUserService
      .searchKeyWord(this.searchTerm$, this.pagedResult.currentPage, this.pagedResult.pageSize)
      .subscribe(result => {
        this.rerender(result);
        this.alertService.success('Thay đổi tình trạng người dùng thành công!');
      }, err => {
        this.alertService.error('Đã xảy ra lỗi. Reload trang không thành công!');
      });
    },
      err => {
        const error = err.json();
        if (error.errorCode === 'BusinessException') {
          this.alertService.error(`${error.errorMessage}`);
        }
      });
  }

  changeGroupUser() {
    this.loading  = true;
    this.groupUserService.changeGroupUser(this.changeUser.id, this.changeUser.userGroup.key).subscribe(response => {
      this.groupUserService.getdataGroupUser(this.pagedResult.currentPage, this.pagedResult.pageSize).subscribe(data => {
        this.pagedResult = data;
        this.loading  = false;
        this.modalRef.hide();
        this.alertService.success('Thay đổi nhóm cho người dùng thành công!');
      });
    },
      err => {
        this.loading  = false;
        this.modalRef.hide();
        const error = err.json();
        if (error.errorCode === 'BusinessException') {
          this.alertService.error(`${error.errorMessage}`);
        }
      });
  }
  deleteUser(idUser: number) {
    this.confirmationService.confirm(
      'Bạn có chắc chắn xóa người dùng được chọn?',
      () => {
        this.groupUserService.deleteUser(idUser).subscribe(response => {
          this.refresh(0, 10);
          this.alertService.success('Xóa người dùng thành công!');
        },
          err => {
            const error = err.json();
            if (error.errorCode === 'BusinessException') {
              this.alertService.error(`${error.errorMessage}`);
            }
          });
      }
    );
  }

  disableMultiple() {
    const deleteIds = this.pagedResult.items
      .filter(x => x.checkboxSelected)
      .map(x => x.id);
    if (deleteIds.length === 0) {
      this.alertService.error(
        'Bạn phải chọn ít nhất một đối tượng để vô hiệu hóa!'
      );
    } else {
      this.confirmationService.confirm(
        'Bạn có chắc chắn vô hiệu hóa những người dùng được chọn?',
        () => {
          this.groupUserService.disableMultipleUser({ ids: deleteIds }).subscribe(response => {
            // this.refresh(0, 10);
            // this.rerender(this.pagedResult);
            this.refresh(this.pagedResult.currentPage, this.pagedResult.pageSize);
            this.alertService.success('Vô hiệu hóa người dùng thành công!');
          },
            err => {
              this.alertService.error('Đã xảy ra lỗi! Vô hiệu hóa người dùng không thành công!');
            });
        }
      );
    }
  }
  resetPassword(id: number, name: string) {
    this.confirmationService.confirm(
      `Bạn có chắc chắn muốn đặt lại mật khẩu cho người dùng "${name}" không?`,
      () => {
        this.groupUserService.resetPassword(id).subscribe( response => {
          this.confirmationService.openResetpassword('Mật khẩu được đặt lại là:', response);
        });
      });
  }
}
