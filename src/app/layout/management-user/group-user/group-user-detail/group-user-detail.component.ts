import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupModel } from '../../../../shared/models/group/group-item.model';
import { Router } from '@angular/router';
import { AlertService, DataService, ConfirmationService, UserService, SessionService } from '../../../../shared/services';
import { GroupUserService } from '../../../../shared/services/group-user.service';
import { GroupUserRequest } from '../../../../shared/models/api-request/user/group-user/group-user-request.model';
import { GroupUserList } from '../../../../shared/models/user/group-user-list-item';
import { DictionaryItem, DictionaryItemIdString, PagedResult } from '../../../../shared/models';
import { LocationListItem } from '../../../../shared/models/setting/location-list-item';
import { Observable, BehaviorSubject, Subject } from '../../../../../../node_modules/rxjs';
import { NgxSpinnerService } from '../../../../../../node_modules/ngx-spinner';
import { DATATABLE_CONFIG } from '../../../../shared/configs';
@Component({
  selector: 'app-group-user-detail',
  templateUrl: './group-user-detail.component.html',
  styleUrls: ['./group-user-detail.component.scss']
})
export class GroupUserDetailComponent implements OnInit {
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = DATATABLE_CONFIG;
  errorMessageBusiness;
  isError;
  pagedResult: PagedResult<GroupUserList[]> = new PagedResult<
    GroupUserList[]
    >();
  searchTerm$ = new BehaviorSubject<string>('');
  groupItem: GroupModel;
  formAddGroupUser: FormGroup;
  submitted = false;
  modalRef: BsModalRef;
  hideInput: boolean;
  textGroup = '';
  idGroup: number;
  arrGroupUser = [
    { id: 1, name: 'Quản trị viên' },
    { id: 2, name: 'Nhóm lưu trữ' },
    { id: 3, name: 'Khác' }
  ];
  listFunctions = [
    { id: 1, name: 'Xem danh sách gói thầu' },
    { id: 2, name: 'Xem chi tiết gói thầu' },
    { id: 3, name: 'Thêm mới gói thầu' },
    { id: 4, name: 'Sửa thông tin chi tiết gói thầu' },
    { id: 5, name: 'Xóa gói thầu' }
  ];
  nameGroup = '';
  isQTV: boolean;
  isAddNewGroup: boolean;
  // listGroupUser: Observable<PagedResult<GroupUserList>>;
  listGroupUser;
  groupEditOrCreate;
  GroupDelete = {
    id: null,
    name: ''
  };
  listPrivilegesData: DictionaryItemIdString[];
  listPrivilegesNotUse: DictionaryItemIdString[];
  groupUserNew: GroupUserRequest;
  arayChangeprivilegesTemp = {
    point: false,
    idGroupCurrent: null,
    arayChangeprivileges: [],
  };
  arayChangeprivilegesTempNot = {
    point: false,
    idGroupCurrent: null,
    arayChangeprivileges: [],
  };
  groupSlected =  null;
  constructor(
    private alertService: AlertService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private groupUserService: GroupUserService,
    private dataService: DataService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private userService: UserService,
    private sessionService: SessionService
  ) { }

  ngOnInit() {
    this.isQTV = false;
    this.hideInput = false;
    this.isAddNewGroup = false;
    this.groupItem = {
      id: null,
      name: '',
    };
    this.formAddGroupUser = this.formBuilder.group({
      nameGroup: ['', Validators.required],
    });

    // Test API GroupUser
    // Danh sách quyền
    this.dataService.getListPrivileges().subscribe(response => {
      this.listPrivilegesData = response;
      // Danh sách nhóm người dùng
      this.spinner.show();
      this.groupUserService.instantSearchGroupUser(this.searchTerm$, 0, 10).subscribe(responsepageResultUserGroup => {
        this.pagedResult = responsepageResultUserGroup;
        this.listGroupUser = this.pagedResult.items;
        this.dtTrigger.next();
        this.spinner.hide();
      });
    });
  }

  checkBox(id: number) {
    // this.idGroup = id;
    this.listGroupUser.forEach(e => {
      if (e.id === id) {
        if (e.checkbox) {
          e.checkbox = !e.checkbox;
        } else {
          e['checkbox'] = true;
        }
      }
    });
  }

  editQTV(id: number) {
    this.idGroup = id;
    this.isQTV = !this.isQTV;
    this.hideInput = !this.hideInput;
    this.groupItem = this.arrGroupUser.find(group => group.id === id);
    this.formAddGroupUser = this.formBuilder.group({
      nameGroup: [this.groupItem.name ? this.groupItem.name : '', Validators.required]
    });
    this.arrGroupUser.forEach(e => {
      if (e.id === id) {
        e['checkId'] = true;
      } else {
        e['checkId'] = false;
      }
    });
  }

  get f() { return this.formAddGroupUser.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.formAddGroupUser.invalid) {
      return;
    }
    this.groupUserNew.userGroupName = this.formAddGroupUser.get('nameGroup').value;
    this.formAddGroupUser.get('nameGroup').patchValue('');
    this.groupUserService.createGroupUser(this.groupUserNew).subscribe(response => {
      this.alertService.success('Thêm mới nhóm người dùng thành công!');
      this.isAddNewGroup = false;
    },
      err => {
        this.alertService.success('Đã gặp sự cố! Thêm mới không thành công!');
      });
  }

  loadItem() {

  }

  AddNewGroup() {
    this.groupUserNew = {
      userGroupName: '',
      userGroupId: null,
      privileges: [],
      notPrivileges: [],
      userGroupActiveCheck: false,
    };
    this.groupUserNew['notPrivileges'] = this.listPrivilegesData;
    this.isAddNewGroup = true;

    this.arayChangeprivilegesTemp = {
      point: false,
      idGroupCurrent: 'new',
      arayChangeprivileges: [],
    };
    this.arayChangeprivilegesTempNot = {
      point: false,
      idGroupCurrent: 'new',
      arayChangeprivileges: [],
    };
  }
  addGroup() {
    this.arrGroupUser.push({
      id: this.arrGroupUser.length + 1,
      name: this.nameGroup
    });
    this.nameGroup = '';
    this.isAddNewGroup = !this.isAddNewGroup;
  }
  removeAdd() {
    // this.nameGroup = '';
    this.formAddGroupUser.get('nameGroup').patchValue('');
    this.isAddNewGroup = !this.isAddNewGroup;
  }

  openModalDelete(idGroupUser: number, template: TemplateRef<any>) {
    console.log('idGroupUser', idGroupUser);
    if (this.listGroupUser.some(i => i.checkbox && (i.checkbox === true))) {
      this.modalRef = this.modalService.show(template);
    } else {
      this.alertService.error('Vui lòng chọn nhóm cần xóa');
    }
  }

  openModalEdit(idGroupUser: number, template: TemplateRef<any>) {
    this.groupEditOrCreate = { ...this.listGroupUser.filter(x => x.id === idGroupUser)[0] };
    // this.groupEditOrCreate = JSON.parse(JSON.stringify(this.listGroupUserData.filter(x => x.id === idGroupUser)[0]));
    const toStringElement = this.groupEditOrCreate.privileges.map(i => JSON.stringify(i));
    const toStringListPrivilegesData = this.listPrivilegesData.map(i => JSON.stringify(i));
    const stringFilter = toStringListPrivilegesData.filter(i => !toStringElement.includes(i));
    this.groupEditOrCreate.notPrivileges = stringFilter.map(i => JSON.parse(i));
    this.modalRef = this.modalService.show(template, {
      class: 'gray modal-lg'
    });
  }

  onDeleteGroup() {
    const request = {
      ids: [Number(this.GroupDelete.id)]
    };
    this.groupUserService.deleteListGroupUser(request).subscribe(response => {
      this.alertService.success('Xóa nhóm người dùng thành công!');
      this.refesh();
    },
      err => {
        this.alertService.success('Đã gặp sự cố. Xóa nhóm người dùng thất bại!');
      });
    this.modalRef.hide();
    this.GroupDelete = {
      id: null,
      name: '',
    };
  }

  activeNewGroup() {
    this.groupUserNew.userGroupActiveCheck = !this.groupUserNew.userGroupActiveCheck;
  }

  selectAllPrivilegesUse(idGroup: number) {
    this.listGroupUser.forEach(i => {
      if (i.id === idGroup) {
        i['notPrivileges'] = [];
        i.privileges = this.listPrivilegesData;
      }
    });
  }

  selectAllPrivilegesNotUse(idGroup: number) {
    this.listGroupUser.forEach(i => {
      if (i.id === idGroup) {
        i['notPrivileges'] = this.listPrivilegesData;
        i.privileges = [];
      }
    });
  }

  selectEachFieldNotUser(event, idGroupUser: number) {
    this.arayChangeprivilegesTemp.idGroupCurrent = idGroupUser;
    this.arayChangeprivilegesTemp.arayChangeprivileges = [];
    for (let i = 1; i <= event.target.length; i++) {
      if (event.target[i - 1].selected === true) {
        const object = {
          id: event.target[i - 1].value,
          text: event.target[i - 1].text,
        };
        this.arayChangeprivilegesTemp.arayChangeprivileges.push(object);
      }
    }
  }

  selectEachFieldUser(event, idGroupUser: number) {
    this.arayChangeprivilegesTempNot.idGroupCurrent = idGroupUser;
    this.arayChangeprivilegesTempNot.arayChangeprivileges = [];
    for (let i = 1; i <= event.target.length; i++) {
      if (event.target[i - 1].selected === true) {
        const object = {
          id: event.target[i - 1].value,
          text: event.target[i - 1].text,
        };
        this.arayChangeprivilegesTempNot.arayChangeprivileges.push(object);
      }
    }
  }

  changePrivilegesUse(idGroupUser: number) {
    if (this.arayChangeprivilegesTempNot.idGroupCurrent === idGroupUser) {
      this.listGroupUser.forEach(e => {
        if (e.id === idGroupUser) {
          this.arayChangeprivilegesTempNot.arayChangeprivileges.forEach(i => e.notPrivileges.push(i));
          const toStringElement = e.notPrivileges.map(i => JSON.stringify(i));
          const toStringListPrivilegesData = this.listPrivilegesData.map(i => JSON.stringify(i));
          const stringFilter = toStringListPrivilegesData.filter(i => !toStringElement.includes(i));
          e.privileges = stringFilter.map(i => JSON.parse(i));
        }
      });
      this.arayChangeprivilegesTempNot = {
        point: true,
        idGroupCurrent: null,
        arayChangeprivileges: [],
      };
    }
  }

  changePrivilegesNotUse(idGroupUser: number) {
    if (this.arayChangeprivilegesTemp.idGroupCurrent === idGroupUser) {
      this.listGroupUser.forEach(e => {
        if (e.id === idGroupUser) {
          this.arayChangeprivilegesTemp.arayChangeprivileges.forEach(i => e.privileges.push(i));
          const toStringElement = e.privileges.map(i => JSON.stringify(i));
          const toStringListPrivilegesData = this.listPrivilegesData.map(i => JSON.stringify(i));
          const stringFilter = toStringListPrivilegesData.filter(i => !toStringElement.includes(i));
          e['notPrivileges'] = stringFilter.map(i => JSON.parse(i));
        }
      });
      this.arayChangeprivilegesTemp = {
        point: true,
        idGroupCurrent: null,
        arayChangeprivileges: [],
      };
    }
  }

  refesh() {
    // Danh sách quyền
    this.dataService.getListPrivileges().subscribe(response => {
      this.listPrivilegesData = response;
      // Danh sách nhóm người dùng
      this.spinner.show();
      this.groupUserService.listGroupUser(0, 10).subscribe(responsepageResultUserGroup => {
        this.pagedResult = responsepageResultUserGroup;
        this.spinner.hide();
        this.listGroupUser = this.pagedResult.items.map(i => i);
        const toStringListPrivilegesData = this.listPrivilegesData.map(i => JSON.stringify(i));
        this.listGroupUser.map(element => {
          const toStringElement = element.privileges.map(i => JSON.stringify(i));
          const stringFilter = toStringListPrivilegesData.filter(i => !toStringElement.includes(i));
          element['notPrivileges'] = stringFilter.map(i => JSON.parse(i));
        });
        this.alertService.success('Dữ liệu được cập nhật mới nhất!');
      },
        err => {
          this.spinner.hide();
          this.alertService.error('Đã xảy ra lỗi, dữ liệu không được cập nhật');
        });
    },
      err => {
        this.alertService.error('Đã xảy ra lỗi, dữ liệu không được cập nhật');
      });
  }

  transferAllPrivilegesNewUser() {
    this.groupUserNew.privileges = this.listPrivilegesData;
    this.groupUserNew['notPrivileges'] = [];
  }

  transferAllNotPrivilegesNewUser() {
    this.groupUserNew.privileges = [];
    this.groupUserNew['notPrivileges'] = this.listPrivilegesData;
  }

  selectEachFieldNewUser(event) {
    this.arayChangeprivilegesTempNot.idGroupCurrent = 'new';
    this.arayChangeprivilegesTempNot.arayChangeprivileges = [];
    for (let i = 1; i <= event.target.length; i++) {
      if (event.target[i - 1].selected === true) {
        const object = {
          id: event.target[i - 1].value,
          text: event.target[i - 1].text,
        };
        this.arayChangeprivilegesTempNot.arayChangeprivileges.push(object);
      }
    }
    console.log('this.arayChangeprivilegesTempNot', this.arayChangeprivilegesTempNot);
  }

  selectEachFieldNotNewUser(event) {
    this.arayChangeprivilegesTemp.idGroupCurrent = 'new';
    this.arayChangeprivilegesTemp.arayChangeprivileges = [];
    for (let i = 1; i <= event.target.length; i++) {
      if (event.target[i - 1].selected === true) {
        const object = {
          id: event.target[i - 1].value,
          text: event.target[i - 1].text,
        };
        this.arayChangeprivilegesTemp.arayChangeprivileges.push(object);
      }
    }
  }

  transferNotPrivilegesNewUser() {
    if (this.arayChangeprivilegesTemp.idGroupCurrent === 'new') {
      this.arayChangeprivilegesTemp.arayChangeprivileges.forEach(i => this.groupUserNew.privileges.push(i));
      const toStringElement = this.groupUserNew.privileges.map(i => JSON.stringify(i));
      const toStringListPrivilegesData = this.listPrivilegesData.map(i => JSON.stringify(i));
      const stringFilter = toStringListPrivilegesData.filter(i => !toStringElement.includes(i));
      this.groupUserNew['notPrivileges'] = stringFilter.map(i => JSON.parse(i));
      this.arayChangeprivilegesTemp = {
        point: true,
        idGroupCurrent: null,
        arayChangeprivileges: [],
      };
    }
    console.log('this.arayChangeprivilegesTemp', this.arayChangeprivilegesTemp, this.groupUserNew);
  }

  changePrivilegesNewUse() {
    if (this.arayChangeprivilegesTempNot.idGroupCurrent === 'new') {
      this.arayChangeprivilegesTempNot.arayChangeprivileges.forEach(i => this.groupUserNew.notPrivileges.push(i));
      const toStringElement = this.groupUserNew.notPrivileges.map(i => JSON.stringify(i));
      const toStringListPrivilegesData = this.listPrivilegesData.map(i => JSON.stringify(i));
      const stringFilter = toStringListPrivilegesData.filter(i => !toStringElement.includes(i));
      this.groupUserNew.privileges = stringFilter.map(i => JSON.parse(i));
      this.arayChangeprivilegesTempNot = {
        point: true,
        idGroupCurrent: null,
        arayChangeprivileges: [],
      };
    }
  }

  pagedResultChange(pagedResult: any) {
    this.spinner.show();
    this.groupUserService.searchGroupUser(this.searchTerm$.value,
      pagedResult.currentPage, pagedResult.pageSize).subscribe(responsepageResultUserGroup => {
        this.pagedResult = responsepageResultUserGroup;
        this.listGroupUser = this.pagedResult.items;
        this.spinner.hide();
      }, err => this.spinner.hide());
  }

  rerender(pagedResult: any) {
    this.pagedResult = pagedResult;
    this.dtTrigger.next();
  }

  selectAllPrivilegesEditUse() {
    this.groupEditOrCreate.notPrivileges = [];
    this.groupEditOrCreate.privileges = this.listPrivilegesData.filter(x => x);
  }

  selectAllPrivilegesEditNotUse() {
    this.groupEditOrCreate.privileges = [];
    this.groupEditOrCreate.notPrivileges = this.listPrivilegesData.filter(x => x);
  }

  selectEachFieldEditUser(event) {
    this.arayChangeprivilegesTempNot.arayChangeprivileges = [];
    for (let i = 1; i <= event.target.length; i++) {
      if (event.target[i - 1].selected === true) {
        const object = {
          id: event.target[i - 1].value,
          text: event.target[i - 1].text,
        };
        this.arayChangeprivilegesTempNot.arayChangeprivileges.push(object);
      }
    }
    this.arayChangeprivilegesTempNot.point = true;
    this.arayChangeprivilegesTemp.point = false;
    console.log(this.arayChangeprivilegesTempNot, this.arayChangeprivilegesTemp);
  }

  selectEachFieldEditNotUser(event) {
    this.arayChangeprivilegesTemp.arayChangeprivileges = [];
    for (let i = 1; i <= event.target.length; i++) {
      if (event.target[i - 1].selected === true) {
        const object = {
          id: event.target[i - 1].value,
          text: event.target[i - 1].text,
        };
        this.arayChangeprivilegesTemp.arayChangeprivileges.push(object);
      }
    }
    this.arayChangeprivilegesTemp.point = true;
    this.arayChangeprivilegesTempNot.point = false;
  }

  changePrivilegesEditNotUse() {
    if (this.arayChangeprivilegesTemp.point === true) {
      this.arayChangeprivilegesTemp.arayChangeprivileges.forEach(i => this.groupEditOrCreate.privileges.push(i));
      const toStringElement = this.groupEditOrCreate.privileges.map(i => JSON.stringify(i));
      const toStringListPrivilegesData = this.listPrivilegesData.map(i => JSON.stringify(i));
      const stringFilter = toStringListPrivilegesData.filter(i => !toStringElement.includes(i));
      this.groupEditOrCreate.notPrivileges = stringFilter.map(i => JSON.parse(i));
      this.arayChangeprivilegesTemp = {
        point: false,
        idGroupCurrent: null,
        arayChangeprivileges: [],
      };
    }

  }

  changePrivilegesEditUse() {
    if (this.arayChangeprivilegesTempNot.point === true) {
      this.arayChangeprivilegesTempNot.arayChangeprivileges.forEach(i => this.groupEditOrCreate.notPrivileges.push(i));
      const toStringElement = this.groupEditOrCreate.notPrivileges.map(i => JSON.stringify(i));
      const toStringListPrivilegesData = this.listPrivilegesData.map(i => JSON.stringify(i));
      const stringFilter = toStringListPrivilegesData.filter(i => !toStringElement.includes(i));
      this.groupEditOrCreate.privileges = stringFilter.map(i => JSON.parse(i));
      this.arayChangeprivilegesTempNot = {
        point: false,
        idGroupCurrent: null,
        arayChangeprivileges: [],
      };
    }
  }

  deactiveGroup(idGroupUser: number) {
    this.groupUserService.deactiveUser(idGroupUser).subscribe(respone => {
      this.refeshPage();
    });
  }

  activateGroup(idGroupUser: number) {
    this.groupUserService.activateUser(idGroupUser).subscribe(respone => {
      this.refeshPage();
    });
  }

  refeshPage() {
    this.spinner.show();
    this.groupUserService.listGroupUser(this.pagedResult.currentPage, this.pagedResult.pageSize)
      .subscribe(responsepageResultUserGroup => {
        this.pagedResult = responsepageResultUserGroup;
        this.listGroupUser = this.pagedResult.items;
        this.spinner.hide();
      }, err => this.spinner.hide());
  }

  ediGroupUser() {
    this.submitted = true;
    if (this.groupEditOrCreate.id) {
      if (this.groupEditOrCreate.name) {
        const resquestModel = {
          id: this.groupEditOrCreate.id,
          name: this.groupEditOrCreate.name,
          description: this.groupEditOrCreate.desc,
          privilegeIds: this.groupEditOrCreate.privileges.map(i => Number(i.id)),
        };
        this.groupUserService.editGroupUser(resquestModel).subscribe(response => {
          this.groupUserService.listGroupUser(this.pagedResult.currentPage, this.pagedResult.pageSize)
            .subscribe(responsepageResultUserGroup => {
              this.pagedResult = responsepageResultUserGroup;
              this.listGroupUser = this.pagedResult.items.map(i => i);
              this.modalRef.hide();
              this.alertService.success('Sửa nhóm người dùng thành công!');
              this.userService.getUserProfile().subscribe(result =>
                this.sessionService.saveUserInfo(result)
              );
            });
        },
          err => {
            this.modalRef.hide();
            this.alertService.error('Đã xảy ra lỗi. Sửa nhóm người dùng không thành công!');
          });
        this.submitted = false;
        this.groupEditOrCreate.id = null;
      }
    } else {
      if (this.groupEditOrCreate.name) {
        this.groupEditOrCreate.userGroupName = this.groupEditOrCreate.name;
        this.groupUserService.createGroupUser(this.groupEditOrCreate).subscribe(response => {
          this.groupUserService.listGroupUser(this.pagedResult.currentPage, this.pagedResult.pageSize)
            .subscribe(responsepageResultUserGroup => {
              this.pagedResult = responsepageResultUserGroup;
              this.listGroupUser = this.pagedResult.items.map(i => i);
              this.modalRef.hide();
              this.userService.getUserProfile().subscribe(result =>
                this.sessionService.saveUserInfo(result)
              );
              this.alertService.success('Thêm nhóm người dùng thành công!');
            });
        },
          err => {
            const error = err.json();
            if (error.errorCode === 'BusinessException') {
              this.isError = true;
              //  this.alertService.error(`${error.errorMessage}`);
            } else {
              this.modalRef.hide();
              this.alertService.error('Đã xảy ra lỗi. Thêm nhóm người dùng không thành công!');
            }

          });
        this.submitted = false;
      }
    }
  }

  openModalCreate(template: TemplateRef<any>) {
    this.isError = false;
    this.modalRef = this.modalService.show(template, {
      class: 'gray modal-lg'
    });
    this.groupEditOrCreate = {
      id: null,
      name: '',
      desc: '',
      isActive: true,
      notPrivileges: this.listPrivilegesData,
      privileges: [],
    };
  }

  openModalDeleteGroupUser(idGroupUser: number, template: TemplateRef<any>) {
    this.listGroupUser.forEach(i => {
      if (i.id === idGroupUser) {
        this.GroupDelete = {
          id: i.id,
          name: i.name
        };
      }
    });
    this.modalRef = this.modalService.show(template);
  }

  delete(ids: any | any[]) {
    const that = this;
    let deleteIds = {};
    if (ids.length > 0) {
      deleteIds = {
        ids: ids.map(x => x.id),
      };
    } else {
      deleteIds = {
        ids: [ids],
      };

    }
    this.groupSlected = this.listGroupUser.filter( elemnt => elemnt.id ===  ids)[0];
    console.log('this.listGroupUser', this.listGroupUser, this.groupSlected);
    console.log('(this.groupSlected.isUsing === true)', this.groupSlected.isUsing , (this.groupSlected.isUsing === true) ? 'a' : 'b');
    this.confirmationService.confirm(
      // console.log(this.pagedResult.items.filter( i => i.id === ids));
      // this.pagedResult.items ? 'Bạn có chắc chắn muốn xóa nhóm người dùng này?' : 'Nhóm người dùng $'
      (this.groupSlected.isUsing === true) ? `Nhóm người dùng "${this.groupSlected.name}" đã được sử dụng, bạn có chắc chắn muốn xóa?`
        : 'Bạn có chắc chắn muốn xóa nhóm người dùng này?',
      () => {
        this.groupUserService.deleteListGroupUser(deleteIds).subscribe(response => {
          // this.alertService.success('Xóa nhóm người dùng thành công!');
          // Danh sách quyền
          this.dataService.getListPrivileges().subscribe(j => {
            this.listPrivilegesData = j;
            // Danh sách nhóm người dùng
            this.spinner.show();
            this.groupUserService.listGroupUser(this.pagedResult.currentPage, this.pagedResult.pageSize)
              .subscribe(responsepageResultUserGroup => {
                this.pagedResult = responsepageResultUserGroup;
                this.spinner.hide();
                this.listGroupUser = this.pagedResult.items.map(i => i);
                const toStringListPrivilegesData = this.listPrivilegesData.map(i => JSON.stringify(i));
                this.listGroupUser.map(element => {
                  const toStringElement = element.privileges.map(i => JSON.stringify(i));
                  const stringFilter = toStringListPrivilegesData.filter(i => !toStringElement.includes(i));
                  element['notPrivileges'] = stringFilter.map(i => JSON.parse(i));
                });
                this.rerender(this.pagedResult);
                this.alertService.success('Xóa nhóm người dùng thành công!');
              },
                err => {
                  this.spinner.hide();
                  this.alertService.error('Đã xảy ra lỗi. Xóa nhóm người dùng không thành công!');
                });
          },
            err => {
              this.alertService.error('Đã xảy ra lỗi. Xóa nhóm người dùng không thành công!');
            });

        },
          err => {
            this.alertService.success('Đã xảy ra lỗi. Xóa nhóm người dùng không thành công!');
          });
        // this.modalRef.hide();
      }
    );
  }

  closedPopup() {
    this.submitted = false;
    this.modalRef.hide();
  }

  multiDelete() {
    console.log(this.listGroupUser);
    const deleteIds = this.listGroupUser
      .filter(x => x.checkboxSelected)
      .map(x => {
        return {
          id: +x.id,
        };
      });
    if (deleteIds.length === 0) {
      this.alertService.error(
        'Bạn phải chọn ít nhất một đối tượng để xóa!'
      );
    } else {
      this.delete(deleteIds);
    }
  }

  onSelectAll(value: boolean) {
    this.pagedResult.items.forEach(x => (x['checkboxSelected'] = value));
  }
}
