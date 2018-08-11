import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { GroupUserModel } from '../../../../../shared/models/user/group-user.model';
import { Router } from '@angular/router';
import { GroupUserService } from '../../../../../shared/services/group-user.service';
import { AlertService, ConfirmationService } from '../../../../../shared/services';
import { ListUserItem } from '../../../../../shared/models/user/user-list-item.model';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  public departments: Array<{ name: string; id: number }> = [
    { id: 7, name: 'Ban giám đốc' },
    { id: 2, name: 'Phòng mời thầu' }
  ];
  public sizes: Array<string> = ['Admin', 'Manager'];
  public selectedSize = 'Admin';

  public positions: Array<{ name: string; id: number }> = [
    { id: 1, name: 'Trưởng phòng' },
    { id: 2, name: 'Phó phòng' }
  ];
  public listGroups: Array<{ text: string, value: number }> = [
    { text: 'Admin', value: 1 },
    { text: 'Nhóm lưu trữ', value: 2 }
  ];
  public selectPosition: number = 1;
  public selectedGroup: number = 1;
  public selectedDepartmaent: number;

  groupUserModel: ListUserItem;
  seft = this;
  formEditUser: FormGroup;
  submitted = false;
  modalRef: BsModalRef;
  userId: number;
  idString: string;
  checkboxTrue: boolean;
  constructor(
    private alertService: AlertService,
    private groupUserService: GroupUserService,
    private modalService: BsModalService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      this.idString = id;
    })

    this.groupUserService.getIdUser(this.idString).subscribe(
      sucess => {
        this.groupUserModel = sucess;
        this.selectedDepartmaent = Number(this.groupUserModel.department.key);
        this.checkboxTrue = this.groupUserModel.isActive;

        this.formEditUser = this.formBuilder.group({
          userName: [this.groupUserModel.userName ? this.groupUserModel.userName : '', Validators.required],
          email: [this.groupUserModel.email ? this.groupUserModel.email : '', Validators.required],
          firstName: [this.groupUserModel.firstName ? this.groupUserModel.firstName : '', Validators.required],
          lastName: [this.groupUserModel.lastName ? this.groupUserModel.lastName : '', Validators.required],
          levelId: [this.groupUserModel.level.key ? this.groupUserModel.level.key : ''],
          userGroupId: [this.groupUserModel.userGroup.id, Validators.required],
          department: [this.selectedDepartmaent ? this.selectedDepartmaent : '', Validators.required],
          isActive: [this.checkboxTrue ? this.checkboxTrue : true],
          password: [''],
          rePassword: ['']
        });
      },
      err => {
        console.log(err);
      }
    );

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
    if (this.formEditUser.invalid) {
      console.log('Lỗi');
      return;
    }
    let dataUser = {
      id:this.idString,
      userName: this.formEditUser.value.userName,
      email: this.formEditUser.value.email,
      lastName: this.formEditUser.value.lastName,
      firstName: this.formEditUser.value.firstName,
      password: this.formEditUser.value.password,
      departmentId: this.formEditUser.value.department,
      levelId: this.formEditUser.value.levelId,
      userGroupId: this.formEditUser.value.userGroupId,
      isActive: this.checkboxTrue
    }
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
}
