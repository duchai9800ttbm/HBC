import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import CustomValidator from '../../../../../shared/helpers/custom-validator.helper';
import { ActivatedRoute, Router } from '@angular/router';
import ValidationHelper from '../../../../../shared/helpers/validation.helper';
import { SettingService } from '../../../../../shared/services/setting.service';
import { AlertService } from '../../../../../shared/services';
@Component({
  selector: 'app-group-configuration-form',
  templateUrl: './group-configuration-form.component.html',
  styleUrls: ['./group-configuration-form.component.scss']
})
export class GroupConfigurationFormComponent implements OnInit {
  config: number;
  groupConfigForm: FormGroup;
  formErrors = {
    groupConfigName: ''
  };
  invalidMessages: string[];
  isSubmitted: boolean;
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private settingService: SettingService,
    private router: Router,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(result => {
      this.config = +result.id;
    });
    if (this.config) {
      this.settingService.detailGroupKPI(this.config).subscribe(response => {
        this.createForm(response);
      });
    } else {
      this.createForm(null);
    }
  }

  createForm(groupKPIItem) {
    this.groupConfigForm = this.fb.group({
      id: groupKPIItem && groupKPIItem.id,
      groupConfigName: [groupKPIItem && groupKPIItem.name, CustomValidator.required],
      groupConfigDes: [groupKPIItem && groupKPIItem.desc],
    });
    this.groupConfigForm.valueChanges
      .subscribe(data => this.onFormValueChanged(data));
  }

  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.groupConfigForm, this.formErrors);
    return this.invalidMessages.length === 0;
  }

  onFormValueChanged(data?: any) {
    if (this.isSubmitted) {
      this.validateForm();
    }
  }

  submitForm() {
    this.isSubmitted = true;
    if (this.validateForm()) {
      // trim()
      this.groupConfigForm.value.groupConfigName = this.groupConfigForm.value.groupConfigName
        ? this.groupConfigForm.value.groupConfigName.trim() : this.groupConfigForm.value.groupConfigName;
      this.groupConfigForm.value.groupConfigDes = this.groupConfigForm.value.groupConfigDes
        ? this.groupConfigForm.value.groupConfigDes.trim() : this.groupConfigForm.value.groupConfigDes;

      if (this.config) {
        this.settingService.editGroupKPI(this.groupConfigForm.value, this.groupConfigForm.value.id).subscribe(response => {
          this.alertService.success('Chỉnh sửa nhóm thành công.');
          this.router.navigate([`/settings/kpi-target/group-config/list`]);
        }, err => {
          if (err._body && JSON.parse(err._body).errorCode === 'BusinessException') {
            this.alertService.error(JSON.parse(err._body).errorMessage);
          } else {
            this.alertService.error('Đã xảy ra lỗi. Chỉnh sửa nhóm không thành công.');
          }
        });
      } else {
        this.settingService.createGroupKPI(this.groupConfigForm.value).subscribe(response => {
          this.alertService.success('Tạo mới nhóm thành công.');
          this.router.navigate([`/settings/kpi-target/group-config/list`]);
        }, err => {
          if (err._body && JSON.parse(err._body).errorCode === 'BusinessException') {
            this.alertService.error(JSON.parse(err._body).errorMessage);
          } else {
            this.alertService.error('Đã xảy ra lỗi. Tạo mới nhóm không thành công.');
          }
        });
      }
    }
  }

}
