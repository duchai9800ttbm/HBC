import {
  Component,
  OnInit
} from '@angular/core';
import {
  ScaleOverall
} from '../../../../../../../../shared/models/site-survey-report/scale-overall.model';
import {
  Router
} from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  FormArray
} from '@angular/forms';
import {
  EditComponent
} from '../edit.component';
import {
  Image,
  ImageItem
} from '../../../../../../../../shared/models/site-survey-report/image';

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
    // this.scaleModel = {
    //   tenTaiLieu: 'Báo cáo tham quan công trình',
    //   lanPhongVan: 3,
    //   loaiCongTrinh: {
    //     vanPhong: true,
    //     khuDanCu: false,
    //     trungTamThuongMai: false,
    //     khachSan: false,
    //     nhaCongNghiep: false,
    //     toHop: false,
    //     canHo: true,
    //     haTang: false,
    //     mep: false,
    //     sanBay: false,
    //     nhaphoBietThu: false,
    //     truongHoc: false,
    //     //
    //     congtrinhMoi: true,
    //     nangCapCaiTien: false,
    //     thayDoiBoSung: false,
    //     thaoDoCaiTien: false,
    //     khac: 'Dự án mẫu',
    //   },
    //   quyMoDuAn: {
    //     dienTichCongTruong: 15389,
    //     tongDienTichXayDung: 114863,
    //     soTang: 'Podium 5 tầng; T6: 36 tầng; T7: 39 tầng',
    //     tienDo: 600
    //   },
    //   hinhAnhPhoiCanh: {
    //     description: 'Text',
    //     images: [{
    //       id: '1',
    //       image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    //     },
    //     {
    //       id: '1',
    //       image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    //     }
    //     ]
    //   },
    //   thongTinVeKetCau: {
    //     description: 'Text',
    //     images: [{
    //       id: '1',
    //       image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    //     },
    //     {
    //       id: '1',
    //       image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    //     }
    //     ]
    //   },
    //   nhungYeuCauDacBiet: {
    //     description: 'Text',
    //     images: [{
    //       id: '1',
    //       image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    //     },
    //     {
    //       id: '1',
    //       image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    //     }
    //     ]
    //   }
    // };

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
      tongDienTichXayDung: [this.scaleModel.quyMoDuAn && this.scaleModel.quyMoDuAn.tongDienTichXayDung],
      soTang: [this.scaleModel.quyMoDuAn && this.scaleModel.quyMoDuAn.soTang],
      tienDo: [this.scaleModel.quyMoDuAn && this.scaleModel.quyMoDuAn.tienDo],
      hinhAnhPhoiCanhDesc: [this.scaleModel.hinhAnhPhoiCanh && this.scaleModel.hinhAnhPhoiCanh.description],
      hinhAnhPhoiCanhList: [null],
      thongTinVeKetCauDesc: [this.scaleModel.thongTinVeKetCau && this.scaleModel.thongTinVeKetCau.description],
      thongTinVeKetCauList: [null],
      nhungYeuCauDacBietDesc: [this.scaleModel.nhungYeuCauDacBiet && this.scaleModel.nhungYeuCauDacBiet.description],
      nhungYeuCauDacBietList: [null]
    });
    this.scaleOverallForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }

  initData() {
    const obj = EditComponent.formModel.scaleOverall;
    if (obj) {
      this.scaleModel.tenTaiLieu = obj.tenTaiLieu ? obj.tenTaiLieu : '';
      this.scaleModel.lanPhongVan = obj.lanPhongVan ? obj.lanPhongVan : 0;
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
      this.scaleModel.hinhAnhPhoiCanh = obj.hinhAnhPhoiCanh && {
        description: obj.hinhAnhPhoiCanh.description,
        images: obj.hinhAnhPhoiCanh.images
      };
      this.scaleModel.thongTinVeKetCau = obj.thongTinVeKetCau && {
        description: obj.thongTinVeKetCau.description,
        images: obj.thongTinVeKetCau.images
      };
      this.scaleModel.nhungYeuCauDacBiet = obj.nhungYeuCauDacBiet && {
        description: obj.nhungYeuCauDacBiet.description,
        images: obj.nhungYeuCauDacBiet.images
      };
      this.perspectiveImageUrls = this.scaleModel.hinhAnhPhoiCanh ? this.scaleModel.hinhAnhPhoiCanh.images : [];
      this.structureImageUrls = this.scaleModel.thongTinVeKetCau ? this.scaleModel.thongTinVeKetCau.images : [];
      this.requirementsImageUrls = this.scaleModel.nhungYeuCauDacBiet ? this.scaleModel.nhungYeuCauDacBiet.images : [];
    }
  }

  mappingToLiveFormData(data) {
    EditComponent.formModel.scaleOverall = new ScaleOverall;
    EditComponent.formModel.scaleOverall.tenTaiLieu = data.tenTaiLieu;
    EditComponent.formModel.scaleOverall.lanPhongVan = data.lanPhongVan;
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
    EditComponent.formModel.scaleOverall.quyMoDuAn = {
      dienTichCongTruong: data.dienTichCongTruong,
      tongDienTichXayDung: data.tongDienTichXayDung,
      soTang: data.soTang,
      tienDo: data.tienDo
    };
    EditComponent.formModel.scaleOverall.hinhAnhPhoiCanh = {
      description: data.hinhAnhPhoiCanhDesc,
      images: this.perspectiveImageUrls
    };
    EditComponent.formModel.scaleOverall.thongTinVeKetCau = {
      description: data.thongTinVeKetCauDesc,
      images: this.structureImageUrls
    };
    EditComponent.formModel.scaleOverall.nhungYeuCauDacBiet = {
      description: data.nhungYeuCauDacBietDesc,
      images: this.requirementsImageUrls
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
      this.scaleOverallForm.get('hinhAnhPhoiCanhList').patchValue(this.perspectiveImageUrls);
    }
  }
  deletePerspectiveImage(i) {
    const index = this.perspectiveImageUrls.indexOf(i);
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
      this.scaleOverallForm.get('thongTinVeKetCauList').patchValue(this.structureImageUrls);
    }
  }
  deleteStructureImage(i) {
    const index = this.structureImageUrls.indexOf(i);
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
      this.scaleOverallForm.get('nhungYeuCauDacBietList').patchValue(this.requirementsImageUrls);
    }
  }
  deleteRequirementsImage(i) {
    const index = this.requirementsImageUrls.indexOf(i);
    this.requirementsImageUrls.splice(index, 1);
  }
}
