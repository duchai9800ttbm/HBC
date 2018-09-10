import { Component, OnInit } from '@angular/core';
import { ScaleOverall } from '../../../../../../../../shared/models/site-survey-report/scale-overall.model';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EditComponent } from '../edit.component';
import { EDOM } from 'constants';

@Component({
  selector: 'app-scale-overall',
  templateUrl: './scale-overall.component.html',
  styleUrls: ['./scale-overall.component.scss']
})
export class ScaleOverallComponent implements OnInit {
  scaleOverallForm: FormGroup;

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
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.scaleModel = new ScaleOverall();
    this.scaleModel = EditComponent.formModel.scaleOverall;
    this.scaleModel = {
      tenTaiLieu: 'Báo cáo tham quan công trình',
      lanPhongVan: 3,
      loaiCongTrinh: {
        vanPhong: true,
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
        //
        congtrinhMoi: true,
        nangCapCaiTien: false,
        thayDoiBoSung: false,
        thaoDoCaiTien: false,
        khac: 'Dự án mẫu',
      },
      quyMoDuAn: {
        dienTichCongTruong: 15389,
        tongDienTichXayDung: 114863,
        soTang: 'Podium 5 tầng; T6: 36 tầng; T7: 39 tầng',
        tienDo: 600
      },
// hinhAnhPhoiCanh: {
//   description: 'Text',
//   images: [
//     {
//       id: '001',
//       image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
//     },
//     {
//       id: '002',
//       image: 'https://images.pexels.com/photos/1055271/pexels-photo-1055271.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
//     },
//     {
//       id: '003',
//       image: 'https://images.pexels.com/photos/134575/pexels-photo-134575.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
//     }
//   ]
// },
// thongTinVeKetCau: {
//   description: 'CÔNG TRÌNH XÂY DỰNG MỚI, BẮT ĐẦU TỪ NẮP HẦM',
//   images: [
//     {
//       id: '001',
//       image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
//     },
//     {
//       id: '002',
//       image: 'https://images.pexels.com/photos/1055271/pexels-photo-1055271.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
//     },
//     {
//       id: '003',
//       image: 'https://images.pexels.com/photos/134575/pexels-photo-134575.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
//     }
//   ]
// },
// nhungYeuCauDacBiet: {
//   description: 'Text',
//   images: [
//     {
//       id: '001',
//       image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
//     },
//     {
//       id: '002',
//       image: 'https://images.pexels.com/photos/1055271/pexels-photo-1055271.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
//     },
//     {
//       id: '003',
//       image: 'https://images.pexels.com/photos/134575/pexels-photo-134575.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
//     }
//   ]
// }
    };
    this.initData();

    this.scaleOverallForm = this.fb.group({
      tenTaiLieu: [this.scaleModel.tenTaiLieu],
      lanPhongVan: [this.scaleModel.lanPhongVan],
      vanPhong: [this.scaleModel.loaiCongTrinh && this.scaleModel.loaiCongTrinh.vanPhong],
      nhaCongNghiep: [this.scaleModel.loaiCongTrinh && this.scaleModel.loaiCongTrinh.nhaCongNghiep],
      mep: [this.scaleModel.loaiCongTrinh && this.scaleModel.loaiCongTrinh.mep],
      khuDanCu: [this.scaleModel.loaiCongTrinh && this.scaleModel.loaiCongTrinh.khuDanCu],
      toHop: [this.scaleModel.loaiCongTrinh && this.scaleModel.loaiCongTrinh.toHop],
      sanBay: [this.scaleModel.loaiCongTrinh && this.scaleModel.loaiCongTrinh.sanBay],
      trungTamThuongMai: [this.scaleModel.loaiCongTrinh && this.scaleModel.loaiCongTrinh.trungTamThuongMai],
      canHo: [this.scaleModel.loaiCongTrinh && this.scaleModel.loaiCongTrinh.canHo],
      nhaphoBietThu: [this.scaleModel.loaiCongTrinh && this.scaleModel.loaiCongTrinh.nhaphoBietThu],
      khachSan: [this.scaleModel.loaiCongTrinh && this.scaleModel.loaiCongTrinh.khachSan],
      haTang: [this.scaleModel.loaiCongTrinh && this.scaleModel.loaiCongTrinh.haTang],
      truongHoc: [this.scaleModel.loaiCongTrinh && this.scaleModel.loaiCongTrinh.truongHoc],
      congtrinhMoi: [this.scaleModel.loaiCongTrinh && this.scaleModel.loaiCongTrinh.congtrinhMoi],
      thayDoiBoSung: [this.scaleModel.loaiCongTrinh && this.scaleModel.loaiCongTrinh.thayDoiBoSung],
      nangCapCaiTien: [this.scaleModel.loaiCongTrinh && this.scaleModel.loaiCongTrinh.nangCapCaiTien],
      thaoDoCaiTien: [this.scaleModel.loaiCongTrinh && this.scaleModel.loaiCongTrinh.thaoDoCaiTien],
      khac: [this.scaleModel.loaiCongTrinh && this.scaleModel.loaiCongTrinh.khac],
      dienTichCongTruong: [this.scaleModel.quyMoDuAn && this.scaleModel.quyMoDuAn.dienTichCongTruong],
      tongDienTich: [this.scaleModel.quyMoDuAn && this.scaleModel.quyMoDuAn.tongDienTichXayDung],
      soTang: [this.scaleModel.quyMoDuAn && this.scaleModel.quyMoDuAn.soTang],
      tienDo: [this.scaleModel.quyMoDuAn && this.scaleModel.quyMoDuAn.tienDo]
      // hinhAnhPhoiCanhText: [this.scaleModel.hinhAnhPhoiCanh.description],
      // hinhAnhPhoiCanhImage: [this.scaleModel.hinhAnhPhoiCanh.images],
      // thongTinVeKetCauText: [this.scaleModel.thongTinVeKetCau.description],
      // thongTinVeKetCauImage: [this.scaleModel.thongTinVeKetCau.images],
      // nhungYeuCauDacBietText: [this.scaleModel.nhungYeuCauDacBiet.description],
      // nhungYeuCauDacBietImage: [this.scaleModel.nhungYeuCauDacBiet.images],

    });
    this.scaleOverallForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));

  }

  initData() {
    // const data = EditComponent.formModel.scaleOverall;
    const obj = EditComponent.formModel.scaleOverall;
    if (obj) {
      console.log(obj);
      this.scaleModel.tenTaiLieu = obj.tenTaiLieu ? obj.tenTaiLieu : '';
      this.scaleModel.lanPhongVan = obj.lanPhongVan ? obj.lanPhongVan : 0;
      // this.scaleModel.loaiCongTrinh.vanPhong = obj.loaiCongTrinh.vanPhong ? obj.loaiCongTrinh.vanPhong : false;
      // this.scaleModel.loaiCongTrinh.nhaCongNghiep = obj.loaiCongTrinh.nhaCongNghiep ? obj.loaiCongTrinh.nhaCongNghiep : false;
      // this.scaleModel.loaiCongTrinh.mep = obj.loaiCongTrinh.mep;
      // this.scaleModel.loaiCongTrinh.khuDanCu = obj.loaiCongTrinh.khuDanCu;
      // this.scaleModel.loaiCongTrinh.toHop = obj.loaiCongTrinh.toHop;
      // this.scaleModel.loaiCongTrinh.sanBay = obj.loaiCongTrinh.sanBay;
      // this.scaleModel.loaiCongTrinh.trungTamThuongMai = obj.loaiCongTrinh.trungTamThuongMai;
      // this.scaleModel.loaiCongTrinh.canHo = obj.loaiCongTrinh.canHo;
      // this.scaleModel.loaiCongTrinh.nhaphoBietThu = obj.loaiCongTrinh.nhaphoBietThu;
      // this.scaleModel.loaiCongTrinh.khachSan = obj.loaiCongTrinh.khachSan;
      // this.scaleModel.loaiCongTrinh.haTang = obj.loaiCongTrinh.haTang;
      // this.scaleModel.loaiCongTrinh.truongHoc = obj.loaiCongTrinh.truongHoc;
      // this.scaleModel.loaiCongTrinh.congtrinhMoi = obj.loaiCongTrinh.congtrinhMoi;
      // this.scaleModel.loaiCongTrinh.thayDoiBoSung = obj.loaiCongTrinh.thayDoiBoSung;
      // this.scaleModel.loaiCongTrinh.nangCapCaiTien = obj.loaiCongTrinh.nangCapCaiTien;
      // this.scaleModel.loaiCongTrinh.thaoDoCaiTien = obj.loaiCongTrinh.thaoDoCaiTien;
      // this.scaleModel.loaiCongTrinh.khac = obj.loaiCongTrinh.khac;
      this.scaleModel.loaiCongTrinh = obj.loaiCongTrinh && {
        vanPhong: obj.loaiCongTrinh.vanPhong,
        nhaCongNghiep: obj.loaiCongTrinh.nhaCongNghiep,
        mep: obj.loaiCongTrinh.mep,
        khuDanCu: obj.loaiCongTrinh.khuDanCu,
        toHop: obj.loaiCongTrinh.toHop,
        sanBay: obj.loaiCongTrinh.sanBay,
        trungTamThuongMai: obj.loaiCongTrinh.trungTamThuongMai,
        canHo: obj.loaiCongTrinh.canHo,
        nhaphoBietThu: obj.loaiCongTrinh.nhaphoBietThu,
        khachSan: obj.loaiCongTrinh.khachSan,
        haTang: obj.loaiCongTrinh.haTang,
        truongHoc: obj.loaiCongTrinh.truongHoc,
        congtrinhMoi: obj.loaiCongTrinh.congtrinhMoi,
        thayDoiBoSung: obj.loaiCongTrinh.thayDoiBoSung,
        nangCapCaiTien: obj.loaiCongTrinh.nangCapCaiTien,
        thaoDoCaiTien: obj.loaiCongTrinh.thaoDoCaiTien,
        khac: obj.loaiCongTrinh.khac

      };
      this.scaleModel.quyMoDuAn = obj.quyMoDuAn && {
        dienTichCongTruong: obj.quyMoDuAn.dienTichCongTruong,
        tongDienTichXayDung: obj.quyMoDuAn.tongDienTichXayDung,
        soTang: obj.quyMoDuAn.soTang,
        tienDo: obj.quyMoDuAn.tienDo
      };
    } else {

      this.scaleModel = {
        tenTaiLieu: 'Báo cáo tham quan công trình',
        lanPhongVan: 3,
        loaiCongTrinh: {
          vanPhong: true,
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
          //
          congtrinhMoi: true,
          nangCapCaiTien: false,
          thayDoiBoSung: false,
          thaoDoCaiTien: false,
          khac: 'Dự án mẫu',
        },
        quyMoDuAn: {
          dienTichCongTruong: 15389,
          tongDienTichXayDung: 114863,
          soTang: 'Podium 5 tầng; T6: 36 tầng; T7: 39 tầng',
          tienDo: 600
        },
      };
    }

  }

  mappingToLiveFormData(data) {
    EditComponent.formModel.scaleOverall = new ScaleOverall;
    EditComponent.formModel.scaleOverall.loaiCongTrinh = {
      vanPhong: data.vanPhong,
      khuDanCu: data.khuDanCu,
      trungTamThuongMai: data.trungTamThuongMai,
      khachSan: data.khachSan,
      nhaCongNghiep: data.nhaCongNghiep,
      toHop: data.toHop,
      canHo: data.canHo,
      haTang: data.haTang,
      mep: data.mep,
      sanBay: data.sanBay,
      nhaphoBietThu: data.nhaphoBietThu,
      truongHoc: data.truongHoc,
      congtrinhMoi: data.congtrinhMoi,
      nangCapCaiTien: data.nangCapCaiTien,
      thayDoiBoSung: data.thayDoiBoSung,
      thaoDoCaiTien: data.thaoDoCaiTien,
      khac: data.khac
    };
    console.log(EditComponent.formModel.scaleOverall);
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
  deletePerspectiveImage() {
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
  deleteStructureImage() {
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
  deleteRequirementsImage() {
    const index = this.requirementsImageUrls.indexOf(this.url);
    this.requirementsImageUrls.splice(index, 1);
  }
}

//
this.scaleModel = {
  documentName: 'Báo cáo tham quan công trình',
  interviewTimes: 3,
  loaiCongTrinh: {
    vanPhong: true,
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
    //
    congtrinhMoi: true,
    nangCapCaiTien: false,
    thayDoiBoSung: false,
    thaoDoCaiTien: false,
    khac: 'Dự án mẫu',
  },
  scale: {
    areaSite: 15389,
    totalArea: 114863,
    numberOfFloor: 'Podium 5 tầng; T6: 36 tầng; T7: 39 tầng',
    progress: 600
  },
  hinhAnhPhoiCanh: {
    description: 'Text',
    images: [
      {
        id: '001',
        image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
      },
      {
        id: '002',
        image: 'https://images.pexels.com/photos/1055271/pexels-photo-1055271.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
      },
      {
        id: '003',
        image: 'https://images.pexels.com/photos/134575/pexels-photo-134575.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
      }
    ]
  },
  thongTinVeKetCau: {
    description: 'CÔNG TRÌNH XÂY DỰNG MỚI, BẮT ĐẦU TỪ NẮP HẦM',
    images: [
      {
        id: '001',
        image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
      },
      {
        id: '002',
        image: 'https://images.pexels.com/photos/1055271/pexels-photo-1055271.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
      },
      {
        id: '003',
        image: 'https://images.pexels.com/photos/134575/pexels-photo-134575.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
      }
    ]
  },
  nhungYeuCauDacBiet: {
    description: 'Text',
    images: [
      {
        id: '001',
        image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
      },
      {
        id: '002',
        image: 'https://images.pexels.com/photos/1055271/pexels-photo-1055271.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
      },
      {
        id: '003',
        image: 'https://images.pexels.com/photos/134575/pexels-photo-134575.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
      }
    ]
  }
};
