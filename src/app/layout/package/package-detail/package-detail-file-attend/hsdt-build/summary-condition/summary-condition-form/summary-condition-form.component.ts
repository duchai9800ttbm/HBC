import { Component, OnInit, OnDestroy } from '@angular/core';
import { PackageService } from '../../../../../../../shared/services/package.service';
import { TenderConditionSummaryRequest } from '../../../../../../../shared/models/api-request/package/tender-condition-summary-request';
import { PackageDetailComponent } from '../../../../package-detail.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../../../../../../../shared/services';
import { HoSoDuThauService } from '../../../../../../../shared/services/ho-so-du-thau.service';
import { Router } from '../../../../../../../../../node_modules/@angular/router';
import { PackageInfoModel } from '../../../../../../../shared/models/package/package-info.model';
import { DuLieuLiveFormDKDT } from '../../../../../../../shared/models/ho-so-du-thau/tom-tat-dkdt.model';

@Component({
  selector: 'app-summary-condition-form',
  templateUrl: './summary-condition-form.component.html',
  styleUrls: ['./summary-condition-form.component.scss']
})
export class SummaryConditionFormComponent implements OnInit, OnDestroy {

  static formModel: TenderConditionSummaryRequest;
  packageId;
  package: PackageInfoModel;
  showPopupConfirm = false;
  constructor(
    private packageService: PackageService,
    private hoSoDuThauService: HoSoDuThauService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
    this.packageId = +PackageDetailComponent.packageId;
    this.packageService.setSummaryConditionForm(true);

    this.packageService.getInforPackageID(this.packageId).subscribe(result => {
      this.package = result;

    }, err => {
    });

    this.hoSoDuThauService.getInfoTenderConditionalSummary(this.packageId).subscribe(data => {
      if (data) {
        this.hoSoDuThauService.emitDataAll(data);
      }
      if (!data) {
        const obj = new DuLieuLiveFormDKDT();
        this.hoSoDuThauService.emitDataAll(obj);
      }
    });
  }

  ngOnDestroy(): void {
    this.packageService.setSummaryConditionForm(false);
    const obj = new DuLieuLiveFormDKDT();
    this.hoSoDuThauService.emitDataAll(obj);
  }

  onSubmit(check: boolean) {
    HoSoDuThauService.tempDataLiveFormDKDT.value.bidOpportunityId = this.packageId;
    HoSoDuThauService.tempDataLiveFormDKDT.value.isDraftVersion = check;
    this.showPopupConfirm = true;
  }
  backSummary() {
    this.router.navigate([`package/detail/${this.packageId}/attend/build/summary`]);
  }
  submitLiveForm(event) {
    if (!event) {
      this.showPopupConfirm = false;
    } else {
      this.hoSoDuThauService.createOrUpdateLiveFormTomTat().subscribe(res => {
        this.router.navigate([`package/detail/${this.packageId}/attend/build/summary`]);
        this.alertService.success(`LiveForm đã được cập nhật!`);
      }, err => {
        this.alertService.error(`Đã có lỗi xảy ra. Cập nhật không thành công!`);
      });
      this.showPopupConfirm = false;
    }
  }

  cancel() {

  }

  refresh() { }


}
