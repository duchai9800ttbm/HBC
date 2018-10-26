import { Component, OnInit, OnDestroy } from '@angular/core';
import { PackageService } from '../../../../../../../shared/services/package.service';
import { TenderConditionSummaryRequest } from '../../../../../../../shared/models/api-request/package/tender-condition-summary-request';
import { PackageDetailComponent } from '../../../../package-detail.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../../../../../../../shared/services';
import { HoSoDuThauService } from '../../../../../../../shared/services/ho-so-du-thau.service';
import { Router, ActivatedRoute } from '../../../../../../../../../node_modules/@angular/router';
import { PackageInfoModel } from '../../../../../../../shared/models/package/package-info.model';
import { DuLieuLiveFormDKDT } from '../../../../../../../shared/models/ho-so-du-thau/tom-tat-dkdt.model';
import { Subscription } from 'rxjs';
import { ScrollToTopService } from '../../../../../../../shared/services/scroll-to-top.service';

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
  isModeView = false;
  isCreate = false;
  isDraft = true;
  subscription: Subscription;
  isClosedHSDT: boolean;
  constructor(
    private packageService: PackageService,
    private hoSoDuThauService: HoSoDuThauService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private scrollTopService: ScrollToTopService
  ) { }

  ngOnInit() {
    this.scrollTopService.isScrollTop = false;
    this.packageId = +PackageDetailComponent.packageId;
    this.packageService.setSummaryConditionForm(true);

    this.packageService.getInforPackageID(this.packageId).subscribe(result => {
      this.package = result;
    }, err => {
    });
    this.subscription = this.hoSoDuThauService.watchStatusPackage().subscribe(status => {
      this.isClosedHSDT = status;
    });

    this.activatedRoute.params.subscribe(data => {
      console.log(data);
      switch (data.action) {
        case 'create': {
          this.isModeView = false;
          this.hoSoDuThauService.emitIsModeView(false);
          this.isCreate = true;
          break;
        }
        case 'edit': {
          this.isModeView = false;
          this.hoSoDuThauService.emitIsModeView(false);
          break;
        }
        case 'detail': {
          this.isModeView = true;
          this.hoSoDuThauService.emitIsModeView(true);
          break;
        }
        default: {
          this.isModeView = false;
          this.hoSoDuThauService.emitIsModeView(false);
          break;
        }
      }
    });

    this.hoSoDuThauService.getInfoTenderConditionalSummary(this.packageId).subscribe(data => {
      if (data) {
        this.hoSoDuThauService.emitDataAll(data);
        this.isDraft = data.isDraftVersion;
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
    if (check || this.isCreate) {
      this.submitLiveForm(true);
    } else {
      this.showPopupConfirm = true;
    }
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
        const message = (this.isCreate) ? 'Tạo' : 'Cập nhật';
        this.alertService.success(`${message} Bảng tóm tắt điều kiện dự thầu thành công!`);
      }, err => {
        const message = (this.isCreate) ? 'Tạo' : 'Cập nhật';
        this.alertService.error(`Đã có lỗi xảy ra. ${message} Bảng tóm tắt điều kiện dự thầu không thành công!`);
      });
      this.showPopupConfirm = false;
    }
  }

  edit() {
    this.hoSoDuThauService.emitIsModeView(false);
    this.router.navigate([`package/detail/${this.packageId}/attend/build/summary/form/edit`]);
  }

  cancel() {

  }

  refresh() { }


}
