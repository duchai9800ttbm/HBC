import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupUserModel } from '../../../../../shared/models/user/group-user.model';
import { Router } from '@angular/router';
import { GroupUserService } from '../../../../../shared/services/group-user.service';
import { AlertService, DataService } from '../../../../../shared/services';
import { ManageUserComponent } from '../manage-user/manage-user.component';
import { DepartmentsFormBranches } from '../../../../../shared/models/user/departments-from-branches';
import { Observable } from '../../../../../../../node_modules/rxjs';
import { Levels } from '../../../../../shared/models/user/levels';
import { DictionaryItem, DictionaryItemIdString } from '../../../../../shared/models';
import CustomValidator from '../../../../../shared/helpers/custom-validator.helper';
import ValidationHelper from '../../../../../shared/helpers/validation.helper';
import { BsModalRef, BsModalService } from '../../../../../../../node_modules/ngx-bootstrap';
import { NgxSpinnerService } from '../../../../../../../node_modules/ngx-spinner';
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  formErrors = {
    userName: '',
    email: '',
    firstName: '',
    lastName: '',
    userGroupId: '',
    departmentId: '',
    password: '',
    rePassword: '',
    phoneNumber: ''
  };
  invalidMessages: string[];
  isError;
  // public departments: Array<{ name: string; id: number }> = [
  //   { id: 1, name: 'Phòng dự thầu' },
  //   { id: 2, name: 'Phòng mời thầu' }
  // ];
  public sizes: Array<string> = ['Admin', 'Manager', 'Normal', 'Reviewer'];
  public selectedSize = 'Reviewer';

  // public positions: Array<{ name: string; id: number }> = [
  //   { id: 1, name: 'Trưởng phòng' },
  //   { id: 2, name: 'Phó phòng' }
  // ];
  public listGroups: Array<{ text: string, value: number }> = [
    { text: 'Admin', value: 1 },
    { text: 'Nhóm lưu trữ', value: 2 }
  ];
  public selectPosition: number = null;
  public selectedGroup: number = null;
  public selectedDepartmaent: number = null;
  groupUserModel: GroupUserModel;
  formAddUser: FormGroup;
  userId: number;
  submitted = false;
  password: string;
  confirmPass: string;
  isValid = false;
  apiError: string;
  isCheckbox = true;
  departments: Observable<DepartmentsFormBranches[]>;
  positions: Observable<Levels[]>;
  dataGroupUser: DictionaryItem[];
  modalRef: BsModalRef;
  GroupCreate;
  submittedCreateGroup: boolean;
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
  constructor(
    private groupUserService: GroupUserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private dataService: DataService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.departments = this.dataService.getListDepartmentsFromBranches();
    this.positions = this.dataService.getListLevels();
    this.dataService.getListPrivileges().subscribe(response => {
      this.listPrivilegesData = response;
    });
    this.groupUserModel = {
      id: null,
      userName: '',
      email: '',
      lastName: '',
      firstName: '',
      rePassword: '',
      password: '',
      departmentId: '',
      levelId: '',
      userGroupId: '',
      isActive: null,
      phoneNumber: null,
      address: '',
    };

    this.formAddUser = this.formBuilder.group({
      userName: ['', [Validators.required, CustomValidator.loginName]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, CustomValidator.password]],
      rePassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      levelId: null,
      userGroupId: null,
      departmentId: [null , Validators.required],
      isActive: [false],
      phoneNumber: ['', [CustomValidator.phoneNumber]],
      address: '',
    });
    this.formAddUser.valueChanges
      .subscribe(data => this.onFormValueChanged(data));
    this.groupUserService.getListAllGroupUser().subscribe(element => {
      this.dataGroupUser = element.map(i => {
        return {
          id: i.id,
          text: i.name,
        };
      });
    });
    console.log('this.formAddUser', this.formAddUser);
  }

  get addUser() { return this.formAddUser.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.validateForm()) {
      if (!this.matchPassword()) {
        this.formErrors.rePassword = 'Mật khẩu không khớp';
        return;
      }
      const dataUser = {
        userName: this.formAddUser.value.userName,
        email: this.formAddUser.value.email,
        lastName: this.formAddUser.value.lastName,
        firstName: this.formAddUser.value.firstName,
        password: this.formAddUser.value.password,
        departmentId: this.formAddUser.value.departmentId ? this.formAddUser.value.departmentId : 0,
        levelId: this.formAddUser.value.levelId ? this.formAddUser.value.levelId : 0,
        userGroupId: this.formAddUser.value.userGroupId ? this.formAddUser.value.userGroupId : 0,
        isActive: this.formAddUser.value.isActive,
        phoneNumber: this.formAddUser.value.phoneNumber,
        address: this.formAddUser.value.address,
      };
      console.log('AddUser', dataUser);
      this.groupUserService.createOrUpdateUser(dataUser).subscribe(data => {
        const message = 'Thêm người dùng thành công';
        this.router.navigate([`/management-user/group-user/manage-user-list/manage-user`]);
        this.alertService.success(message);
      },
        err => {
          console.log('massage-massage-massage', JSON.parse(err._body).errorMessage);
          if (JSON.parse(err._body).errorMessage === 'Tên đăng nhập của bạn trùng với tên đăng nhập của nhân viên khác!') {
            this.formErrors.userName = 'Tên đăng nhập trùng với tên đăng nhập của nhân viên khác!';
          }
        });
    }
  }
  isCheckboxAction() {
    this.isCheckbox = !this.isCheckbox;
  }
  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(
      this.formAddUser,
      this.formErrors,
    );
    console.log('this.invalidMessages', this.invalidMessages);
    return this.invalidMessages.length === 0;
  }

  matchPassword() {
    const newPassword = this.formAddUser.get('password').value;
    const confirmPassword = this.formAddUser.get('rePassword').value;
    return newPassword === confirmPassword;
  }

  onFormValueChanged(data?: any) {
    if (this.submitted) {
      this.validateForm();
    }
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
    console.log('this.listPrivilegesData', this.listPrivilegesData);
    this.modalRef = this.modalService.show(template, {
      class: 'gray modal-lg'
    });
  }

  closedPopup() {
    this.submittedCreateGroup = false;
    this.modalRef.hide();
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
          this.groupUserService.getListAllGroupUser().subscribe( e => {
            const groupnew = e.filter( k => k.name === this.GroupCreate.name)[0];
            this.formAddUser.get('userGroupId').patchValue(groupnew.id);
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
}
