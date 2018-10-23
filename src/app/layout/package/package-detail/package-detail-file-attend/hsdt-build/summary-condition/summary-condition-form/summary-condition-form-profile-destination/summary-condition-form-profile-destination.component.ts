import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SummaryConditionFormComponent } from '../summary-condition-form.component';
import { ApiConvertHelper } from '../../../../../../../../shared/helpers/api-convert.helper';
import DateTimeConvertHelper from '../../../../../../../../shared/helpers/datetime-convert-helper';
import { HoSoDuThauService } from '../../../../../../../../shared/services/ho-so-du-thau.service';
import { DienGiaiYeuCauHoSo } from '../../../../../../../../shared/models/ho-so-du-thau/danh-sach-vat-tu';
import { AlertService } from '../../../../../../../../shared/services';
import { PackageService } from '../../../../../../../../shared/services/package.service';
import { PackageDetailComponent } from '../../../../../package-detail.component';

@Component({
  selector: 'app-summary-condition-form-profile-destination',
  templateUrl: './summary-condition-form-profile-destination.component.html',
  styleUrls: ['./summary-condition-form-profile-destination.component.scss']
})
export class SummaryConditionFormProfileDestinationComponent implements OnInit {

  yeuCauHoSoForm: FormGroup;
  dienGiaiYeuCauHoSo = new DienGiaiYeuCauHoSo();
  isModeView = false;
  packageId;
  constructor(
    private fb: FormBuilder,
    private hoSoDuThauService: HoSoDuThauService,
    private packageService: PackageService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.packageId = +PackageDetailComponent.packageId;
    this.hoSoDuThauService.watchLiveformState().subscribe(data => {
      this.isModeView = data.isModeView;
    });
    this.loadData();
    this.createForm();
  }
  // getInfoPackage() {
  //   this.packageService.getInforPackageID(this.packageId).subscribe(result => {
  //     this.closingTime = result.submissionDate;
  //     console.log(this.closingTime);
  //   }, err => {
  //     this.alertService.error('Tải thông tin gói thầu thất bại.');
  //   });
  // }

  loadData() {
    this.hoSoDuThauService.watchDataLiveForm()
      .subscribe(data => {
        const model = data.dienGiaiYeuCauHoSo;
        if (model) {
          this.dienGiaiYeuCauHoSo = model && {
            noiNop: model.noiNop,
            nguoiNhan: model.nguoiNhan,
            hanNop: model.hanNop
          };
        }
        if (!model) {
          this.packageService.getInforPackageID(this.packageId).subscribe(result => {
            const closingTime = result.submissionDate;
            this.dienGiaiYeuCauHoSo = {
              noiNop: '',
              nguoiNhan: '',
              hanNop: closingTime
            };
            console.log(closingTime);
            console.log(this.dienGiaiYeuCauHoSo);
          }, err => {
            this.alertService.error('Tải thông tin gói thầu thất bại.');
          });
        }
      });
  }

  createForm() {
    this.yeuCauHoSoForm = this.fb.group({
      noiNop: {
        value: this.dienGiaiYeuCauHoSo.noiNop,
        disabled: this.isModeView
      },
      nguoiNhan: {
        value: this.dienGiaiYeuCauHoSo.nguoiNhan,
        disabled: this.isModeView
      },
      hanNop: {
        value: DateTimeConvertHelper.fromTimestampToDtObject(this.dienGiaiYeuCauHoSo.hanNop * 1000),
        disabled: this.isModeView
      }
    });
    this.yeuCauHoSoForm.valueChanges.subscribe(data => {
      let obj = new DienGiaiYeuCauHoSo();
      obj = data;
      obj.hanNop = DateTimeConvertHelper.fromDtObjectToTimestamp(data.hanNop);
      this.hoSoDuThauService.emitDataStepDestination(obj);
    });
  }
}
