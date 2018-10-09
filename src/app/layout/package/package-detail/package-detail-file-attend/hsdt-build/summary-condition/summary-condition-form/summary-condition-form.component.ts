import { Component, OnInit, OnDestroy } from '@angular/core';
import { PackageService } from '../../../../../../../shared/services/package.service';
import { TenderConditionSummaryRequest } from '../../../../../../../shared/models/api-request/package/tender-condition-summary-request';
import { PackageDetailComponent } from '../../../../package-detail.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../../../../../../../shared/services';
import { HoSoDuThauService } from '../../../../../../../shared/services/ho-so-du-thau.service';

@Component({
  selector: 'app-summary-condition-form',
  templateUrl: './summary-condition-form.component.html',
  styleUrls: ['./summary-condition-form.component.scss']
})
export class SummaryConditionFormComponent implements OnInit, OnDestroy {

  static formModel: TenderConditionSummaryRequest;
  packageId;
  showPopupConfirm = false;
  constructor(
    private packageService: PackageService,
    private hoSoDuThauService: HoSoDuThauService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.packageService.setSummaryConditionForm(true);
  }

  ngOnDestroy(): void {
    this.packageService.setSummaryConditionForm(false);
  }

  onSubmit() {
    this.showPopupConfirm = true;
  }
  submitLiveForm(event) {
    if (!event) {
      this.showPopupConfirm = false;
    } else {
      const dataLiveform = HoSoDuThauService.tempDataLiveFormDKDT.value;
      console.log(dataLiveform);
      this.hoSoDuThauService.createOrUpdateLiveFormTomTat(dataLiveform).subscribe(res => {
        this.alertService.success(`LiveForm đã được cập nhật!`);
      }, err => {
        this.alertService.error(`Đã có lỗi xảy ra. Cập nhật không thành công!`);
      });
      this.showPopupConfirm = false;
    }
  }


}
