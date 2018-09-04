import { Component, OnInit } from '@angular/core';
import { ScaleOverall } from '../../../../../../../../shared/models/site-survey-report/scale-overall.model';
import { Router } from '@angular/router';

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
    private router: Router
  ) { }

  ngOnInit() {
    this.scaleModel = new ScaleOverall();
    this.scaleModel = {
      documentName: 'Báo cáo tham quan công trình',
      interviewTimes: 3,
      vanPhong: false,
      khuDanCu: false,
      trungTamThuongMai: false,
      khachSan: false,
      nhaCongNghiep: false,
      toHop: false,
      canHo: true,
      haTang: false,
      mep: false,
      sanBay: false,
      nhaphoBietThu: false,
      truongHoc: false,
      congtrinhMoi: false,
      nangCapCaiTien: false,
      thayDoiBoSung: false,
      thaoDoCaiTien: false,
      khac: null,
      scale: {
        areaSite: 15389,
        totalArea: 114863,
        numberOfFloor: 'Podium 5 tầng; T6: 36 tầng; T7: 39 tầng',
        progess: 600
      },
      hinhAnhPhoiCanh: {
        description: 'Demo miêu tả phối cảnh',
        images: [
          {
            id: '001',
            // tslint:disable-next-line:max-line-length
            image: 'https://www.google.com.vn/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwicrOnAkqHdAhXNdH0KHfImD2oQjRx6BAgBEAU&url=http%3A%2F%2Fthuvienanhdep.net%2Fnhung-hinh-anh-hot-girl-cuc-xinh-va-dang-yeu-danh-lam-hinh-nen-dien-thoai%2F&psig=AOvVaw2ENc-rTTvHCOZxXX5RpcS7&ust=1536143466729323'
          }
        ]
      },
      thongTinVeKetCau: null,
      nhungYeuCauDacBiet: null
    };
  }

  uploadPerspectiveImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.perspectiveImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteImg0() {
    const index = this.perspectiveImageUrls.indexOf(this.url);
    this.perspectiveImageUrls.splice(index, 1);
  }

  uploadStructureImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.structureImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteImg1() {
    const index = this.structureImageUrls.indexOf(this.url);
    this.structureImageUrls.splice(index, 1);
  }

  uploadRequirementsImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.requirementsImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteImg2() {
    const index = this.requirementsImageUrls.indexOf(this.url);
    this.requirementsImageUrls.splice(index, 1);
  }

  addDisplayImg() {
    window.onclick = e => {
      const x = (<HTMLInputElement>event.target).className;
      console.log(x);
    };
  }
}
