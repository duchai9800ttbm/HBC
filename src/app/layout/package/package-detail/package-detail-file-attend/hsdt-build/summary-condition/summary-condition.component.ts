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
      tenTaiLieu: 'Bảng tóm tắt điều kiện dự thầu - 1',
      lanPhongVan: 1,
      hinhAnhPhoiCanh: [],
      banVeMasterPlan: [],
      dienGiaiThongTinDuAn: 'Diễn giải thông tin tổng quan dự án'
    };
    obj.cacBenLienQuan = {
      chuDauTu: {
        donVi: 'Riviera Point Limited Liability Company (Keppel Land)',
        lienHe: ['Nguyễn B'],
        ghiChu: 'Ghi chú chủ đầu tư'
      },
      quanLyDuAn: {
        donVi: 'Công ty TNHH ABC',
        lienHe: ['Nguyễn A'],
        ghiChu: 'Ghi chú quản lý dự án'
      },
      quanLyChiPhi: {
        donVi: 'Công ty TNHH XYZ',
        lienHe: ['Nguyễn C'],
        ghiChu: 'Ghi chú quản lý chi phí'
      },
      thietKeKienTruc: {
        donVi: 'Công ty MTV An Tâm',
        lienHe: ['Nguyễn A'],
        ghiChu: 'Ghi chú thiết kế kiến trúc'
      },
      thietKeKetCau: {
        donVi: 'Công ty MTV Yên Tâm',
        lienHe: ['Nguyễn B'],
        ghiChu: 'Ghi chú thiết kế kết cấu'
      },
      thietKeCoDien: [
        {
          donVi: 'Công ty CP Điện Cơ',
          lienHe: ['Nguyễn C'],
          ghiChu: 'Ghi chú Cơ Điện'
        },
        {
          donVi: 'Công ty CP Sáng Xanh',
          lienHe: ['Nguyễn A'],
          ghiChu: 'Ghi chú 2 Cơ Điện'
        }
      ],
      thongTinKhac: {
        donVi: 'Công ty CP Kincocha',
        lienHe: ['Trần B'],
        ghiChu: 'Ghi chú thông tin khác'
      }
    };
    // obj.phamViCongViec = {
    //   phamViBaoGom: [
    //     {
    //       congTac: 'Công tác 1',
    //       dienGiaiCongTac: 'Mô tả công tác 1'
    //     },
    //     {
    //       congTac: 'Công tác 1',
    //       dienGiaiCongTac: 'Mô tả công tác 1'
    //     },

    //     {
    //       congTac: 'Công tác 1',
    //       dienGiaiCongTac: 'Mô tả công tác 1'
    //     },
    //     {
    //       congTac: 'Công tác 1',
    //       dienGiaiCongTac: 'Mô tả công tác 1'
    //     }
    //   ],
    //   phamViKhongBaoGom: [
    //     {
    //       congTac: 'Công tác 1',
    //       dienGiaiCongTac: 'Mô tả công tác 1'
    //     },
    //     {
    //       congTac: 'Công tác 1',
    //       dienGiaiCongTac: 'Mô tả công tác 1'
    //     },
    //     {
    //       congTac: 'Công tác 1',
    //       dienGiaiCongTac: 'Mô tả công tác 1'
    //     },
    //     {
    //       congTac: 'Công tác 1',
    //       dienGiaiCongTac: 'Mô tả công tác 1'
    //     },
    //     {
    //       congTac: 'Công tác 1',
    //       dienGiaiCongTac: 'Mô tả công tác 1'
    //     }
    //   ]
    // };
    this.hoSoDuThauService.emitDataAll(obj);
  }

}
