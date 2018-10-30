import { Component, OnInit, Input } from '@angular/core';
import { ConstructionTypeListItem } from '../../../../shared/models/setting/construction-type-list-item';
import { FormGroup, FormBuilder } from '../../../../../../node_modules/@angular/forms';
import { SettingService } from '../../../../shared/services/setting.service';
import { Router } from '../../../../../../node_modules/@angular/router';
import { AlertService } from '../../../../shared/services';
import CustomValidator from '../../../../shared/helpers/custom-validator.helper';
import ValidationHelper from '../../../../shared/helpers/validation.helper';

@Component({
  selector: 'app-setting-construction-form',
  templateUrl: './setting-construction-form.component.html',
  styleUrls: ['./setting-construction-form.component.scss']
})
export class SettingConstructionFormComponent implements OnInit {

  @Input() construction: ConstructionTypeListItem;
  constructionForm: FormGroup;
  formErrors = {
    constructionTypeName: ''
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
    this.constructionForm = this.fb.group({
      id: this.construction.id,
      constructionTypeName: [this.construction.constructionTypeName, CustomValidator.required],
      constructionTypeNameEng: this.construction.constructionTypeNameEng,
      constructionTypeDesc: this.construction.constructionTypeDesc
    });
    this.constructionForm.valueChanges
      .subscribe(data => this.onFormValueChanged(data));
  }

  submitForm() {
    const constructionTypeName = this.constructionForm.get('constructionTypeName').value;
    this.isSubmitted = true;
    const valid = this.validateForm();
    if (valid) {
      this.settingService.createOrUpdateConstruction(this.constructionForm.value).subscribe(data => {
        const message = this.construction.id
          ? `Loại công trình ${constructionTypeName} đã được cập nhật thành công.`
          : `Loại công trình ${constructionTypeName} đã được tạo mới thành công.`;
        this.router.navigate([`/settings/construction`]);
        this.alertService.success(message);
      }, err => {
        const error = err.json();
        if (error.errorCode === 'BusinessException') {
          this.alertService.error(`"${constructionTypeName}" này đã tồn tại`);
        } else {
          this.alertService.error('Đã xảy ra lỗi ! Vui lòng thử lại sau.');
        }
      });
    }
  }

  onFormValueChanged(data?: any) {
    if (this.isSubmitted) {
      this.validateForm();
    }
  }

  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.constructionForm, this.formErrors);
    return this.invalidMessages.length === 0;
  }

}
