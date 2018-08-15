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
import { DictionaryItem } from '../../../../../shared/models';
import { Observable } from '../../../../../../../node_modules/rxjs';
import { DepartmentsFormBranches } from '../../../../../shared/models/user/departments-from-branches';
import { Levels } from '../../../../../shared/models/user/levels';
import ValidationHelper from '../../../../../shared/helpers/validation.helper';
import CustomValidator from '../../../../../shared/helpers/custom-validator.helper';
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
    departmentId: '',
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
  constructor(
    private alertService: AlertService,
    private groupUserService: GroupUserService,
    private modalService: BsModalService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder,
    private dataService: DataService,
  ) { }

  ngOnInit() {
    this.departments = this.dataService.getListDepartmentsFromBranches();
    this.positions = this.dataService.getListLevels();
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      this.idString = id;
    });

    this.groupUserService.getIdUser(this.idString).subscribe(
      sucess => {
        this.groupUserModel = sucess;
        console.log('this.success', sucess);
        this.checkboxTrue = this.groupUserModel.isActive;
        this.formEditUser = this.formBuilder.group({
          userName: [this.groupUserModel.userName ? this.groupUserModel.userName : '', [Validators.required, CustomValidator.loginName]],
          email: [this.groupUserModel.email ? this.groupUserModel.email : '', [Validators.required, Validators.email]],
          firstName: [this.groupUserModel.firstName ? this.groupUserModel.firstName : '', Validators.required],
          lastName: [this.groupUserModel.lastName ? this.groupUserModel.lastName : '', Validators.required],
          levelId: [this.groupUserModel.level ? this.groupUserModel.level.key : null],
          userGroupId: [this.groupUserModel.userGroup ? this.groupUserModel.userGroup.id : null, Validators.required],
          department: [this.groupUserModel.department ? Number(this.groupUserModel.department.key) : null, Validators.required],
          isActive: [this.checkboxTrue ? this.checkboxTrue : true],
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
        console.log(err);
      }
    );
    this.groupUserService.getListAllGroupUser().subscribe(element => {
      this.dataGroupUser = element.map(i => {
        return {
          id: i.id,
          text: i.name,
        };
      });
      console.log('element-element', element);
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
    console.log('this.validateForm', this.validateForm(), this.formErrors, this.formEditUser);
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
        isActive: this.checkboxTrue
      };
      console.log('Edit', dataUser);
      this.groupUserService.createOrUpdateUser(dataUser).subscribe(data => {
        const message = 'Chỉnh sửa người dùng thành công!';
        this.router.navigate([`/management-user/group-user/manage-user-list/manage-user`]);
        this.alertService.success(message);
      },
        err => {
          console.log(err);
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

}
