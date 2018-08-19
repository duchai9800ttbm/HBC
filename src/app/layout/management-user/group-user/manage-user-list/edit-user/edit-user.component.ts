import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { GroupUserModel } from '../../../../../shared/models/user/group-user.model';
import { Router } from '@angular/router';
import { GroupUserService } from '../../../../../shared/services/group-user.service';
import { AlertService, ConfirmationService, DataService } from '../../../../../shared/services';
import { ListUserItem } from '../../../../../shared/models/user/user-list-item.model';
import { DictionaryItem, DictionaryItemIdString } from '../../../../../shared/models';
import { Observable } from '../../../../../../../node_modules/rxjs';
import { DepartmentsFormBranches } from '../../../../../shared/models/user/departments-from-branches';
import { Levels } from '../../../../../shared/models/user/levels';
import ValidationHelper from '../../../../../shared/helpers/validation.helper';
import CustomValidator from '../../../../../shared/helpers/custom-validator.helper';
import { NgxSpinnerService } from '../../../../../../../node_modules/ngx-spinner';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  invalidMessages: string[];
  // public departments: Array<{ name: string; id: number }> = [
  //   { id: 7, name: 'Ban giám đốc' },
  //   { id: 2, name: 'Phòng mời thầu' }
  // ];
  public sizes: Array<string> = ['Admin', 'Manager'];
  public selectedSize = 'Admin';

  // public positions: Array<{ name: string; id: number }> = [
  //   { id: 1, name: 'Trưởng phòng' },
  //   { id: 2, name: 'Phó phòng' }
  // ];
  public listGroups: Array<{ text: string, value: number }> = [
    { text: 'Admin', value: 1 },
    { text: 'Nhóm lưu trữ', value: 2 }
  ];
  public selectPosition = 1;
  public selectedGroup = 1;
  public selectedDepartmaent: number;
  groupUserModel: ListUserItem;
  formErrors = {
    userName: '',
    email: '',
    firstName: '',
    lastName: '',
    // departmentId: '',
    phoneNumber: '',
    department: '',
  };
  seft = this;
  formEditUser: FormGroup;
  submitted = false;
  modalRef: BsModalRef;
  userId: number;
  idString: string;
  checkboxTrue: boolean;
  dataGroupUser: DictionaryItem[];
  departments: Observable<DepartmentsFormBranches[]>;
  positions: Observable<Levels[]>;
  GroupCreate;
  isError;
  listPrivilegesData: DictionaryItemIdString[];
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
  submittedCreateGroup: boolean;
  constructor(
    private alertService: AlertService,
    private groupUserService: GroupUserService,
    private modalService: BsModalService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.departments = this.dataService.getListDepartmentsFromBranches();
    this.positions = this.dataService.getListLevels();
    this.dataService.getListPrivileges().subscribe(response => {
      this.listPrivilegesData = response;
    });
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      this.idString = id;
    });
    this.groupUserService.getIdUser(this.idString).subscribe(
      sucess => {
        this.groupUserModel = sucess;
        this.checkboxTrue = this.groupUserModel.isActive;
        this.formEditUser = this.formBuilder.group({
          userName: [this.groupUserModel.userName ? this.groupUserModel.userName : '', [Validators.required, CustomValidator.loginName]],
          email: [this.groupUserModel.email ? this.groupUserModel.email : '', [Validators.required, Validators.email]],
          firstName: [this.groupUserModel.firstName ? this.groupUserModel.firstName : '', Validators.required],
          lastName: [this.groupUserModel.lastName ? this.groupUserModel.lastName : '', Validators.required],
          levelId: [this.groupUserModel.level ? this.groupUserModel.level.key : null],
          userGroupId: [this.groupUserModel.userGroup ? this.groupUserModel.userGroup.id : null, Validators.required],
          department: [this.groupUserModel.department ? Number(this.groupUserModel.department.key) : null, Validators.required],
          isActive: [this.groupUserModel.isActive],
          password: ['', [CustomValidator.password]],
          rePassword: ['', [CustomValidator.password]],
          phoneNumber: [this.groupUserModel.phoneNumber, [CustomValidator.phoneNumber]],
          address: this.groupUserModel.address,
        });
        this.formEditUser.valueChanges.subscribe(data => {
          this.onFormValueChanged(data);
        });
      },
      err => {
      }
    );
    this.groupUserService.getListAllGroupUser().subscribe(element => {
      this.dataGroupUser = element.map(i => {
        return {
          id: i.id,
          text: i.name,
        };
      });
    });
  }

  clickCheckboxAction() {
    this.checkboxTrue = !this.checkboxTrue;
  }

  openModalDelete(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  get addUser() { return this.formEditUser.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.validateForm()) {
      const dataUser = {
        id: this.idString,
        userName: this.formEditUser.value.userName,
        email: this.formEditUser.value.email,
        lastName: this.formEditUser.value.lastName,
        firstName: this.formEditUser.value.firstName,
        password: this.formEditUser.value.password,
        departmentId: this.formEditUser.value.department ? this.formEditUser.value.department : 0,
        levelId: this.formEditUser.value.levelId ? this.formEditUser.value.levelId : 0,
        userGroupId: this.formEditUser.value.userGroupId ? this.formEditUser.value.userGroupId : 0,
        isActive: this.formEditUser.value.isActive,
        phoneNumber: this.formEditUser.value.phoneNumber,
        address: this.formEditUser.value.address,
      };
      this.groupUserService.createOrUpdateUser(dataUser).subscribe(data => {
        const message = 'Chỉnh sửa người dùng thành công!';
        this.router.navigate([`/management-user/group-user/manage-user-list/manage-user`]);
        this.alertService.success(message);
      },
        err => {
        });
    }
  }

  deleteLocation(id: string | number) {
    this.confirmationService.confirm(
      'Bạn có chắc chắn muốn xóa người dùng này?',
      () => {
        this.groupUserService.deleteUser(id).subscribe(
          result => {
            this.alertService.success('Đã xóa người dùng!');

          },
          err => {
            this.alertService.success(
              'Đã gặp lỗi, chưa xóa được người dùng!'
            );
          }
        );
        this.router.navigate(['/management-user/group-user/manage-user-list/manage-user']);
      }
    );
  }

  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(
      this.formEditUser,
      this.formErrors,
    );
    return this.invalidMessages.length === 0;
  }

  onFormValueChanged(data?: any) {
    if (this.submitted) {
      this.validateForm();
    }
  }

  changeActiveUser(idUser: number) {
  }

  openModalCreateUser(template: TemplateRef<any>) {
    this.isError = false;
    this.GroupCreate = {
      name: null,
      description: '',
      privileges: [],
      isActive: true,
      notPrivileges: this.listPrivilegesData,
    };
    this.modalRef = this.modalService.show(template, {
      class: 'gray modal-lg'
    });
  }

  selectAllPrivilegesEditUse() {
    this.GroupCreate.notPrivileges = [];
    this.GroupCreate.privileges = this.listPrivilegesData.filter(x => x);
  }

  selectAllPrivilegesEditNotUse() {
    this.GroupCreate.privileges = [];
    this.GroupCreate.notPrivileges = this.listPrivilegesData.filter(x => x);
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
  }

  changePrivilegesEditNotUse() {
    if (this.arayChangeprivilegesTemp.point === true) {
      this.arayChangeprivilegesTemp.arayChangeprivileges.forEach(i => this.GroupCreate.privileges.push(i));
      const toStringElement = this.GroupCreate.privileges.map(i => JSON.stringify(i));
      const toStringListPrivilegesData = this.listPrivilegesData.map(i => JSON.stringify(i));
      const stringFilter = toStringListPrivilegesData.filter(i => !toStringElement.includes(i));
      this.GroupCreate.notPrivileges = stringFilter.map(i => JSON.parse(i));
      this.arayChangeprivilegesTemp = {
        point: false,
        idGroupCurrent: null,
        arayChangeprivileges: [],
      };
    }
  }

  changePrivilegesEditUse() {
    if (this.arayChangeprivilegesTempNot.point === true) {
      this.arayChangeprivilegesTempNot.arayChangeprivileges.forEach(i => this.GroupCreate.notPrivileges.push(i));
      const toStringElement = this.GroupCreate.notPrivileges.map(i => JSON.stringify(i));
      const toStringListPrivilegesData = this.listPrivilegesData.map(i => JSON.stringify(i));
      const stringFilter = toStringListPrivilegesData.filter(i => !toStringElement.includes(i));
      this.GroupCreate.privileges = stringFilter.map(i => JSON.parse(i));
      this.arayChangeprivilegesTempNot = {
        point: false,
        idGroupCurrent: null,
        arayChangeprivileges: [],
      };
    }
  }

  addGroupUser() {
    this.submittedCreateGroup = true;
    if (this.GroupCreate.name) {
      this.GroupCreate.userGroupName = this.GroupCreate.name;
      this.spinner.show();
      this.groupUserService.createGroupUser(this.GroupCreate).subscribe(response => {
        // this.groupUserService.listGroupUser(this.pagedResult.currentPage, this.pagedResult.pageSize)
        //   .subscribe(responsepageResultUserGroup => {
        //     this.pagedResult = responsepageResultUserGroup;
        //     this.listGroupUser = this.pagedResult.items.map(i => i);
        //     this.modalRef.hide();
        //     this.alertService.success('Thêm nhóm người dùng thành công!');
        //   });
        this.modalRef.hide();
        this.alertService.success('Thêm nhóm người dùng thành công!');
        this.groupUserService.getListAllGroupUser().subscribe(element => {
          this.dataGroupUser = element.map(i => {
            return {
              id: i.id,
              text: i.name,
            };
          });
        });
        this.groupUserService.getListAllGroupUser().subscribe(e => {
          const groupnew = e.filter(k => k.name === this.GroupCreate.name)[0];
          this.formEditUser.get('userGroupId').patchValue(groupnew.id);
          this.spinner.hide();
        });
      },
        err => {
          const error = err.json();
          if (error.errorCode === 'BusinessException') {
            this.isError = true;
          } else {
            this.modalRef.hide();
            this.alertService.error('Đã xảy ra lỗi. Thêm nhóm người dùng không thành công!');
          }

        });
      this.submitted = false;
    }
  }

  closedPopup() {
    this.submittedCreateGroup = false;
    this.modalRef.hide();
  }
}
