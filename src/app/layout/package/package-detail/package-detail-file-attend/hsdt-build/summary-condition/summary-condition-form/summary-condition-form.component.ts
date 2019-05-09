import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PackageService } from '../../../../../../../shared/services/package.service';
import { TenderConditionSummaryRequest } from '../../../../../../../shared/models/api-request/package/tender-condition-summary-request';
import { PackageDetailComponent } from '../../../../package-detail.component';
import { AlertService } from '../../../../../../../shared/services';
import { HoSoDuThauService } from '../../../../../../../shared/services/ho-so-du-thau.service';
import { Router, ActivatedRoute } from '../../../../../../../../../node_modules/@angular/router';
import { PackageInfoModel } from '../../../../../../../shared/models/package/package-info.model';
import { DuLieuLiveFormDKDT } from '../../../../../../../shared/models/ho-so-du-thau/tom-tat-dkdt.model';
// tslint:disable-next-line: import-blacklist
import { Subscription } from 'rxjs';
import { ScrollToTopService } from '../../../../../../../shared/services/scroll-to-top.service';
import { ThongTinDuAn } from '../../../../../../../shared/models/ho-so-du-thau/thong-tin-du-an';
import Utils from '../../../../../../../shared/helpers/utils.helper';

@Component({
  selector: 'app-summary-condition-form',
  templateUrl: './summary-condition-form.component.html',
  styleUrls: ['./summary-condition-form.component.scss']
})
export class SummaryConditionFormComponent implements OnInit, OnDestroy {
  static formModel: TenderConditionSummaryRequest;
  formModelCompare: DuLieuLiveFormDKDT;
  @ViewChild('scrollView') scrollView;
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
    private alertService: AlertService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private scrollTopService: ScrollToTopService
  ) { }

  ngOnInit() {
    this.scrollTopService.isScrollTop = false;
    this.packageId = +PackageDetailComponent.packageId;
    this.packageService.setSummaryConditionForm(true);
    this.subscription = this.hoSoDuThauService.watchStatusPackage().subscribe(status => {
      this.isClosedHSDT = status;
    });
    const getInFoPackage$ = this.packageService.getInforPackageID(this.packageId).subscribe(result => {
      this.package = result;
    });
    const activate$ = this.activatedRoute.params.subscribe(data => {
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
          this.formModelCompare = HoSoDuThauService.tempDataLiveFormDKDT.value;
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

    const getInfoTender$ = this.hoSoDuThauService.getInfoTenderConditionalSummary(this.packageId).subscribe(data => {
      if (data) {
        this.hoSoDuThauService.emitDataAll(data);
        this.isDraft = data.isDraftVersion;
        this.formModelCompare = {...data};
      }
      if (!data) {
        const obj = new DuLieuLiveFormDKDT();
        obj.thongTinDuAn = new ThongTinDuAn();
        obj.thongTinDuAn.lanPhongVan = 1;
        // Initialization OtherRequirement
        const otherRequirement = {
          tenderEvaluation: 'Tender Evaluation',
          tenderEvaluationSteps: 'Two (02) steps',
          tenderEvaluationStep1: 'Preliminary Evaluation',
          tenderEvaluationStep2: 'Detail Evaluation',
          requirementDetails: [
            {
              requirementName: 'Green Building Standard',
              requirementDesc: '',
              requirementLink: 'Green Mark'
            },
            {
              requirementName: 'Profit, Overhead and Attendance',
              requirementDesc: 'Maximum',
              requirementLink: '3%'
            }
          ]
        };
        obj.yeuCauDacBietKhac = otherRequirement;

        this.hoSoDuThauService.emitDataAll(obj);
      }
    });
    const scrollView$ = this.hoSoDuThauService.emplementScroll().subscribe(() => {
      this.scrollToView();
    });
    this.subscription.add(getInFoPackage$);
    this.subscription.add(activate$);
    this.subscription.add(getInfoTender$);
    this.subscription.add(scrollView$);
  }

  ngOnDestroy(): void {
    this.packageService.setSummaryConditionForm(false);
    const obj = new DuLieuLiveFormDKDT();
    this.hoSoDuThauService.emitDataAll(obj);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSubmit(check: boolean, saveAll: boolean) {
    console.log(1);
    const previousStatus = HoSoDuThauService.tempDataLiveFormDKDT.value.isDraftVersion;
    HoSoDuThauService.tempDataLiveFormDKDT.value.bidOpportunityId = this.packageId;
    HoSoDuThauService.tempDataLiveFormDKDT.value.isDraftVersion = check;
    if (check || this.isCreate || previousStatus) {
      this.submitLiveForm(true, saveAll);
    } else {
      console.log(11);
      // nếu 2 obj = nhau, không cần thông báo
      const isEqual = Utils.isEqual({...HoSoDuThauService.tempDataLiveFormDKDT.value}, this.formModelCompare);
      if (saveAll) {
        isEqual ? this.router.navigate([`package/detail/${this.packageId}/attend/build/summary`]) : this.showPopupConfirm = true;
      } else {
        this.submitLiveForm(true, saveAll);
      }
    }
  }
  backSummary() {
    SummaryConditionFormComponent.formModel = null;
    this.router.navigate([`package/detail/${this.packageId}/attend/build/summary`]);
  }
  submitLiveForm(event, saveAll) {
    console.log(2);
    if (!event) {
      this.showPopupConfirm = false;
    } else {
      this.hoSoDuThauService.createOrUpdateLiveFormTomTat().subscribe(res => {
        this.hoSoDuThauService.detectUploadFile(true);
        if (saveAll) { this.router.navigate([`package/detail/${this.packageId}/attend/build/summary`]); }
        const message = (this.isCreate) ? 'Tạo' : 'Cập nhật';
        if (res.result.id) {
          this.isCreate = false;
        }
        this.alertService.success(`${message} Bảng tóm tắt điều kiện dự thầu thành công!`);
        if (!res.result.isDraftVersion) { this.hoSoDuThauService.detectCondition(true); }
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
  refresh() {

  }

  scrollToView() {
    const position = this.scrollView.nativeElement.offsetTop - 110;
    window.scroll({
      top: position,
      left: 35,
      behavior: 'smooth'
    });
  }
}
