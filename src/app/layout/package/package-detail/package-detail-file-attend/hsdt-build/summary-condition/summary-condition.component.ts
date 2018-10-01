import { Component, OnInit } from '@angular/core';
import { PackageDetailComponent } from '../../../package-detail.component';
import { PackageService } from '../../../../../../shared/services/package.service';
import { TenderConditionSummaryRequest } from '../../../../../../shared/models/api-request/package/tender-condition-summary-request';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../../../../../../shared/services';
import { DATATABLE_CONFIG } from '../../../../../../shared/configs';
// tslint:disable-next-line:import-blacklist
import { Subject } from 'rxjs';
import { SummaryConditionFormComponent } from './summary-condition-form/summary-condition-form.component';
import { DuLieuLiveFormDKDT } from '../../../../../../shared/models/ho-so-du-thau/tom-tat-dkdt.model';
import { HoSoDuThauService } from '../../../../../../shared/services/ho-so-du-thau.service';

@Component({
  selector: 'app-summary-condition',
  templateUrl: './summary-condition.component.html',
  styleUrls: ['./summary-condition.component.scss']
})
export class SummaryConditionComponent implements OnInit {

  packageId;
  hasTender;
  tenderConditionSummary: TenderConditionSummaryRequest;
  dtOptions: any = DATATABLE_CONFIG;
  dtTrigger: Subject<any> = new Subject();
  constructor(
    private hoSoDuThauService: HoSoDuThauService,
    private packageService: PackageService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.fakeData();
    this.packageId = PackageDetailComponent.packageId;
    this.spinner.show();
    this.packageService.getTenderConditionSummary(this.packageId).subscribe(data => {
      if (data) {
        this.hasTender = true;
        this.tenderConditionSummary = data;
        SummaryConditionFormComponent.formModel = data;
      } else {
        this.hasTender = false;
      }
      this.spinner.hide();
      setTimeout(() => {
        this.dtTrigger.next();
      });
    }, err => {
      this.spinner.hide();
      this.alertService.error('Đã có lỗi xảy ra, vui lòng thử lại!');
    });
  }

  fakeData() {
    const obj = new DuLieuLiveFormDKDT();
    obj.thongTinDuAn = {
      tenTaiLieu: 'TaiLieu Test',
      lanPhongVan: 2,
      hinhAnhPhoiCanh: [],
      banVeMasterPlan: [],
      dienGiaiThongTinDuAn: 'Test dien giai'
    };
    this.hoSoDuThauService.emitDataAll(obj);
  }

}
