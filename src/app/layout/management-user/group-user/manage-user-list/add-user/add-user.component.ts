import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupUserModel } from '../../../../../shared/models/user/group-user.model';
import { Router } from '@angular/router';
import { GroupUserService } from '../../../../../shared/services/group-user.service';
import { AlertService, DataService } from '../../../../../shared/services';
import { ManageUserComponent } from '../manage-user/manage-user.component';
import { DepartmentsFormBranches } from '../../../../../shared/models/user/departments-from-branches';
import { Observable } from '../../../../../../../node_modules/rxjs';
import { Levels } from '../../../../../shared/models/user/levels';
import { DictionaryItem } from '../../../../../shared/models';
import CustomValidator from '../../../../../shared/helpers/custom-validator.helper';
import ValidationHelper from '../../../../../shared/helpers/validation.helper';
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  formErrors = {
    userName: '',
    email: '',
    firstName: '',
    lastName: '',
    userGroupId: '',
    department: '',
    password: '',
    rePassword: '',
  };
  invalidMessages: string[];
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
  constructor(
    private groupUserService: GroupUserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private dataService: DataService,
  ) { }

  ngOnInit() {
    this.departments = this.dataService.getListDepartmentsFromBranches();
    this.positions = this.dataService.getListLevels();
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
      isActive: null
    };

    this.formAddUser = this.formBuilder.group({
      userName: ['', [Validators.required, CustomValidator.loginName]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, CustomValidator.password]],
      rePassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      levelId: [''],
      userGroupId: [''],
      departmentId: ['', Validators.required],
      isActive: [null],
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
        departmentId: this.formAddUser.value.departmentId,
        levelId: this.formAddUser.value.levelId,
        userGroupId: this.formAddUser.value.userGroupId,
        isActive: this.isCheckbox
      };
      console.log('AddUser', dataUser);
      this.groupUserService.createOrUpdateUser(dataUser).subscribe(data => {
        const message = 'Thêm người dùng thành công';
        this.router.navigate([`/management-user/group-user/manage-user-list/manage-user`]);
        this.alertService.success(message);
      },
        err => {
          console.log('massage-massage-massage', JSON.parse(err._body).errorMessage ) ;
          if ( JSON.parse(err._body).errorMessage === 'Tên đăng nhập của bạn trùng với tên đăng nhập của nhân viên khác!') {
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
}
