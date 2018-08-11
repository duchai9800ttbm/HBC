import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '../../../../../../node_modules/@angular/forms';
import CustomValidator from '../../../../shared/helpers/custom-validator.helper';
import { LocationListItem } from '../../../../shared/models/setting/location-list-item';
import ValidationHelper from '../../../../shared/helpers/validation.helper';
import { SettingService } from '../../../../shared/services/setting.service';
import { Router } from '../../../../../../node_modules/@angular/router';
import { AlertService } from '../../../../shared/services';

@Component({
  selector: 'app-setting-location-form',
  templateUrl: './setting-location-form.component.html',
  styleUrls: ['./setting-location-form.component.scss']
})
export class SettingLocationFormComponent implements OnInit {

  locationForm: FormGroup;
  @Input() location: LocationListItem;
  formErrors = {
    locationName: ''
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
    this.locationForm = this.fb.group({
      id: this.location.id,
      locationName: [this.location.locationName, CustomValidator.required],
      locationDesc: this.location.locationDesc
    });
    this.locationForm.valueChanges
      .subscribe(data => this.onFormValueChanged(data));
  }

  submitForm() {
    this.isSubmitted = true;
    const valid = this.validateForm();
    if (valid) {
      this.settingService.createOrUpdateLocation(this.locationForm.value).subscribe(data => {
        const message = this.location.id
          ? 'Khu vực đã được chỉnh sửa.'
          : 'Khu vực đã được tạo.';
        this.router.navigate([`/settings`]);
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
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.locationForm, this.formErrors);
    return this.invalidMessages.length === 0;
  }

}
