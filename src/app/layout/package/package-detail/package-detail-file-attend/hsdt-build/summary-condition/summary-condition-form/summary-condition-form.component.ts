import { Component, OnInit, OnDestroy } from '@angular/core';
import { PackageService } from '../../../../../../../shared/services/package.service';
import { TenderConditionSummaryRequest } from '../../../../../../../shared/models/api-request/package/tender-condition-summary-request';
import { PackageDetailComponent } from '../../../../package-detail.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../../../../../../../shared/services';
import { HoSoDuThauService } from '../../../../../../../shared/services/ho-so-du-thau.service';
import { Router } from '../../../../../../../../../node_modules/@angular/router';

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
    private alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
    this.packageId = +PackageDetailComponent.packageId;
    this.packageService.setSummaryConditionForm(true);
    // HoSoDuThauService.tempDataLiveFormDKDT.value.cacBenLienQuan = [
    //   {
    //     id: 10,
    //     groupName: null,
    //     groupDesc: null,
    //     customers: [
    //       {
    //         customerId: 140,
    //         customerName: null,
    //         customerNo: null,
    //         customerDesc: null,
    //         note: 'abcd',
    //         contacts: [
    //           {
    //             id: 130,
    //             name: 'Chị Linh'
    //           },
    //           {
    //             id: 125,
    //             name: 'Chị Hạnh'
    //           }
    //         ]
    //       }
    //     ]
    //   },
    //   {
    //     id: 11,
    //     groupName: null,
    //     groupDesc: null,
    //     customers: []
    //   },
    //   {
    //     id: 12,
    //     groupName: null,
    //     groupDesc: 'Quản lý chi phí',
    //     customers: []
    //   },
    //   {
    //     id: 13,
    //     groupName: 'ThietKeKienTruc',
    //     groupDesc: 'Thiết kế kiến trúc',
    //     customers: []
    //   },
    //   {
    //     id: 14,
    //     groupName: 'ThietKeKetCau',
    //     groupDesc: 'Thiết kế kết cấu',
    //     customers: []
    //   },
    //   {
    //     id: 15,
    //     groupName: 'ThietKeCoDien',
    //     groupDesc: 'Thiết kế cơ điện',
    //     customers: []
    //   },
    //   {
    //     id: 16,
    //     groupName: 'Khac',
    //     groupDesc: 'Khác',
    //     customers: []
    //   }
    // ];
  }

  ngOnDestroy(): void {
    this.packageService.setSummaryConditionForm(false);
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
      const dataLiveform = HoSoDuThauService.tempDataLiveFormDKDT.value;
      this.hoSoDuThauService.createOrUpdateLiveFormTomTat(dataLiveform).subscribe(res => {
        this.alertService.success(`LiveForm đã được cập nhật!`);
      }, err => {
        this.alertService.error(`Đã có lỗi xảy ra. Cập nhật không thành công!`);
      });
      this.showPopupConfirm = false;
    }
  }


}
