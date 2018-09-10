import { Component, OnInit, OnDestroy } from '@angular/core';
// import { LiveformDataReportService } from '../../../../../../../shared/services/liveform-data-report.service';
import { Router } from '@angular/router';
import { ScaleOverall } from '../../../../../../../../shared/models/site-survey-report/scale-overall.model';
// import { ScaleOverall } from '../../../../../../../shared/models/site-survey-report/scale-overall.model';

@Component({
  selector: 'app-scale-overall',
  templateUrl: './scale-overall.component.html',
  styleUrls: ['./scale-overall.component.scss']
})
export class ScaleOverallComponent implements OnInit {
  siteArea;
  totalBuildArea;
  floorNumbers;
  progress;

  perspectiveImageUrls = [];
  structureImageUrls = [];
  requirementsImageUrls = [];
  url;
  scaleModel: ScaleOverall;
  constructor(
    // private liveformDataReportService: LiveformDataReportService,
    private router: Router
  ) { }

  ngOnInit() {
    this.scaleModel = new ScaleOverall();
    // this.scaleModel = {
    //   tenTaiLieu: 'Báo cáo tham quan công trình',
    //   lanPhongVan: 3,
    //   vanPhong: false,
    //   khuDanCu: false,
    //   trungTamThuongMai: false,
    //   khachSan: false,
    //   nhaCongNghiep: false,
    //   toHop: false,
    //   canHo: true,
    //   haTang: false,
    //   mep: false,
    //   sanBay: false,
    //   nhaphoBietThu: false,
    //   truongHoc: false,
    //   congtrinhMoi: false,
    //   nangCapCaiTien: false,
    //   thayDoiBoSung: false,
    //   thaoDoCaiTien: false,
    //   khac: null,
    //   scale: {
    //     areaSite: 15389,
    //     totalArea: 114863,
    //     numberOfFloor: 'Podium 5 tầng; T6: 36 tầng; T7: 39 tầng',
    //     progress: 600
    //   },
    //   hinhAnhPhoiCanh: {
    //     description: 'Demo miêu tả phối cảnh',
    //     images: [
    //       {
    //         id: '001',
    //         // tslint:disable-next-line:max-line-length
    //         image: 'https://www.google.com.vn/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwicrOnAkqHdAhXNdH0KHfImD2oQjRx6BAgBEAU&url=http%3A%2F%2Fthuvienanhdep.net%2Fnhung-hinh-anh-hot-girl-cuc-xinh-va-dang-yeu-danh-lam-hinh-nen-dien-thoai%2F&psig=AOvVaw2ENc-rTTvHCOZxXX5RpcS7&ust=1536143466729323'
    //       }
    //     ]
    //   },
    //   thongTinVeKetCau: null,
    //   nhungYeuCauDacBiet: null
    // };
  }
}
