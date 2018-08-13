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
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

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
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rePassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      levelId: [''],
      userGroupId: [''],
      departmentId: ['', Validators.required],
      isActive: [null],
    });
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
    if (this.formAddUser.invalid) {
      return;
    }
    console.log(' this.formAddUser', this.formAddUser);
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
        console.log(err);
      });
  }
  isCheckboxAction() {
    this.isCheckbox = !this.isCheckbox;
  }
}
