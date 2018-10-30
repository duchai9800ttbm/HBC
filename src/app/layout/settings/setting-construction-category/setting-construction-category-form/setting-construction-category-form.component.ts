import { Component, OnInit, Input } from '@angular/core';
import { ConstructionCategoryListItem } from '../../../../shared/models/setting/construction-category-list-item';
import { FormGroup, FormBuilder } from '../../../../../../node_modules/@angular/forms';
import { SettingService } from '../../../../shared/services/setting.service';
import { Router } from '../../../../../../node_modules/@angular/router';
import { AlertService } from '../../../../shared/services';
import ValidationHelper from '../../../../shared/helpers/validation.helper';
import CustomValidator from '../../../../shared/helpers/custom-validator.helper';

@Component({
  selector: 'app-setting-construction-category-form',
  templateUrl: './setting-construction-category-form.component.html',
  styleUrls: ['./setting-construction-category-form.component.scss']
})
export class SettingConstructionCategoryFormComponent implements OnInit {

  @Input() constructionCategory: ConstructionCategoryListItem;
  constructionCategoryForm: FormGroup;
  formErrors = {
    constructionCategoryName: ''
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
    this.constructionCategoryForm = this.fb.group({
      id: this.constructionCategory.id,
      constructionCategoryName: [this.constructionCategory.constructionCategoryName, CustomValidator.required],
      constructionCategoryDesc: this.constructionCategory.constructionCategoryDesc
    });
    this.constructionCategoryForm.valueChanges
      .subscribe(data => this.onFormValueChanged(data));
  }

  submitForm() {
    const constructionCategoryName = this.constructionCategoryForm.get('constructionCategoryName').value;
    this.isSubmitted = true;
    const valid = this.validateForm();
    if (valid) {
      this.settingService.createOrUpdateConstructionCategory(this.constructionCategoryForm.value).subscribe(data => {
        const message = this.constructionCategory.id
          ? `Hạng mục thi công công trình ${constructionCategoryName} đã được cập nhật thành công.`
          : `Hạng mục thi công công trình ${constructionCategoryName} đã được tạo mới thành công.`;
        this.router.navigate([`/settings/construction-category`]);
        this.alertService.success(message);
      }, err => {
        const error = err.json();
        if (error.errorCode === 'BusinessException') {
          this.alertService.error(`"${constructionCategoryName}" này đã tồn tại`);
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
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.constructionCategoryForm, this.formErrors);
    return this.invalidMessages.length === 0;
  }

}
