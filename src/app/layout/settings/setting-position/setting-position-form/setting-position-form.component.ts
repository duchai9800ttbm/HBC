import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '../../../../../../node_modules/@angular/forms';
import CustomValidator from '../../../../shared/helpers/custom-validator.helper';
import ValidationHelper from '../../../../shared/helpers/validation.helper';
import { SettingService } from '../../../../shared/services/setting.service';
import { Router } from '../../../../../../node_modules/@angular/router';
import { AlertService } from '../../../../shared/services';
import { LevelListItem } from '../../../../shared/models/setting/level-list-item';
@Component({
  selector: 'app-setting-position-form',
  templateUrl: './setting-position-form.component.html',
  styleUrls: ['./setting-position-form.component.scss']
})
export class SettingPositionFormComponent implements OnInit {
  levelForm: FormGroup;
  @Input() level: LevelListItem;
  formErrors = {
    levelName: ''
  };
  isSubmitted: boolean;
  invalidMessages: string[];

  constructor(
    private fb: FormBuilder,
    private settingService: SettingService,
    private router: Router,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.levelForm = this.fb.group({
      id: this.level.id,
      levelName: [this.level.levelName, CustomValidator.required],
      levelDesc: this.level.levelDesc
    });
    this.levelForm.valueChanges
      .subscribe(data => this.onFormValueChanged(data));
  }

  submitForm() {
    const levelName = this.levelForm.get('levelName').value;
    this.isSubmitted = true;
    const valid = this.validateForm();
    if (valid) {
      this.settingService.createOrUpdateLevel(this.levelForm.value).subscribe(data => {
        const message = this.level.id
          ? `Vị trị/Chức vụ ${levelName} đã được cập nhật thành công.`
          : `Vị trị/Chức vụ ${levelName} đã được tạo mới thành công.`;
        this.router.navigate([`/settings/position`]);
        this.alertService.success(message);
      });
    }
  }

  onFormValueChanged(data?: any) {
    if (this.isSubmitted) {
      this.validateForm();
    }
  }

  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.levelForm, this.formErrors);
    return this.invalidMessages.length === 0;
  }


}
