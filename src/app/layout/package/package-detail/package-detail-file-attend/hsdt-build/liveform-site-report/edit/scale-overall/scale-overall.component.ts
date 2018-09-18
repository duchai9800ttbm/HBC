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
  FormArray,
  FormControl
} from '@angular/forms';
import {
  EditComponent
} from '../edit.component';
import {
  Image,
  ImageItem
} from '../../../../../../../../shared/models/site-survey-report/image';
import { LiveformSiteReportComponent } from '../../liveform-site-report.component';

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
  loaiCongTrinhForm: FormGroup;
  loaiCongTrinhList = [];
  trangThaiCongTrinhForm: FormGroup;
  trangthaiCongTrinhList = [];
  perspectiveImageUrls = [{ file: null, base64: null }];
  structureImageUrls = [];
  requirementsImageUrls = [];
  url;
  scaleModel = new ScaleOverall();
  constructor(
    private router: Router,
    private fb: FormBuilder,

  ) { }

  ngOnInit() {
    this.initData();
    this.scaleOverallForm = this.fb.group({
      tenTaiLieu: [this.scaleModel.tenTaiLieu],
      lanPhongVan: [this.scaleModel.lanPhongVan],
      loaiCongTrinhList: [null],
      trangthaiCongTrinhList: [null],
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

    const controlss = this.loaiCongTrinhList.map(c => new FormControl(false));
    this.loaiCongTrinhForm = this.fb.group({
      loaiCongTrinhList: new FormArray(controlss)
    });
    const controls = this.trangthaiCongTrinhList.map(c => new FormControl(false));
    this.trangThaiCongTrinhForm = this.fb.group({
      trangthaiCongTrinhList: new FormArray(controls)
    });
    this.scaleOverallForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }

  initData() {
    const obj = LiveformSiteReportComponent.formModel.scaleOverall;
    if (obj) {
      this.scaleModel.tenTaiLieu = obj.tenTaiLieu ? obj.tenTaiLieu : '';
      this.scaleModel.lanPhongVan = obj.lanPhongVan ? obj.lanPhongVan : 0;
      this.loaiCongTrinhList = (obj.loaiCongTrinh.length) ? obj.loaiCongTrinh : [
        {
          value: 'Văn phòng (Office)',
          text: '',
          checked: false
        },
        {
          value: 'Nhà công nghiệp (Industrial))',
          text: '',
          checked: false
        },
        {
          value: 'MEP',
          text: '',
          checked: false
        },
        {
          value: 'Khu dân cư (Residential)',
          text: '',
          checked: false
        },
        {
          value: 'Tổ hợp (Mixed use)',
          text: '',
          checked: false
        },
        {
          value: 'Sân bay',
          text: '',
          checked: false
        },
        {
          value: 'TT Thương mại (Commercial)',
          text: '',
          checked: false
        },
        {
          value: 'Căn hộ',
          text: '',
          checked: false
        },
        {
          value: 'Nhà phố, biệt thự',
          text: '',
          checked: false
        },
        {
          value: 'Khách sạn/Resort (Hotel/Resort)',
          text: '',
          checked: false
        },
        {
          value: 'Hạ tầng',
          text: '',
          checked: false
        },
        {
          value: 'Trường học',
          text: '',
          checked: false
        }
      ];
      this.trangthaiCongTrinhList = (obj.trangthaiCongTrinh.length) ? obj.trangthaiCongTrinh : [
        {
          value: 'Mới (New)',
          text: '',
          checked: false
        },
        {
          value: 'Thay đổi & bổ sung (Alteration & Additional)',
          text: '',
          checked: false
        },
        {
          value: 'Khác (Other)',
          text: '',
          checked: false
        },
        {
          value: 'Nâng cấp, cải tiến (Renovation)',
          text: '',
          checked: false
        }, {
          value: 'Tháo dỡ & cải tiến (Demolishment & Renovation)',
          text: '',
          checked: false
        }
      ];
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
      // array.map(function(currentValue, index, arr), thisValue)
      this.perspectiveImageUrls = this.scaleModel.hinhAnhPhoiCanh ? this.scaleModel.hinhAnhPhoiCanh.images : [];
      this.structureImageUrls = this.scaleModel.thongTinVeKetCau ? this.scaleModel.thongTinVeKetCau.images : [];
      this.requirementsImageUrls = this.scaleModel.nhungYeuCauDacBiet ? this.scaleModel.nhungYeuCauDacBiet.images : [];
    }
  }

  mappingToLiveFormData(data) {
    LiveformSiteReportComponent.formModel.scaleOverall = new ScaleOverall;
    LiveformSiteReportComponent.formModel.scaleOverall.tenTaiLieu = data.tenTaiLieu;
    LiveformSiteReportComponent.formModel.scaleOverall.lanPhongVan = data.lanPhongVan;
    LiveformSiteReportComponent.formModel.scaleOverall.loaiCongTrinh = this.loaiCongTrinhList;
    LiveformSiteReportComponent.formModel.scaleOverall.trangthaiCongTrinh = this.trangthaiCongTrinhList;
    LiveformSiteReportComponent.formModel.scaleOverall.quyMoDuAn = {
      dienTichCongTruong: data.dienTichCongTruong,
      tongDienTichXayDung: data.tongDienTichXayDung,
      soTang: data.soTang,
      tienDo: data.tienDo
    };
    LiveformSiteReportComponent.formModel.scaleOverall.hinhAnhPhoiCanh = {
      description: data.hinhAnhPhoiCanhDesc,
      images: this.perspectiveImageUrls.map() // TODO map lên 1 object
    };
    LiveformSiteReportComponent.formModel.scaleOverall.thongTinVeKetCau = {
      description: data.thongTinVeKetCauDesc,
      images: this.structureImageUrls
    };
    LiveformSiteReportComponent.formModel.scaleOverall.nhungYeuCauDacBiet = {
      description: data.nhungYeuCauDacBietDesc,
      images: this.requirementsImageUrls
    };
  }

  uploadPerspectiveImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.perspectiveImageUrls.push({
          file: file,
          base64: e.target.result
        });
        reader.readAsDataURL(file);
      }
      this.scaleOverallForm.get('hinhAnhPhoiCanhList').patchValue(this.perspectiveImageUrls);
      console.log(this.perspectiveImageUrls);
    }
  }

  deletePerspectiveImage(i) {
    const index = this.perspectiveImageUrls.indexOf(i);
    this.perspectiveImageUrls.splice(index, 1);
    this.scaleOverallForm.get('hinhAnhPhoiCanhList').patchValue(this.perspectiveImageUrls);
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
    this.scaleOverallForm.get('thongTinVeKetCauList').patchValue(this.structureImageUrls);
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
    this.scaleOverallForm.get('nhungYeuCauDacBietList').patchValue(this.requirementsImageUrls);
  }
  loaiCongTrinhChange() {
    this.scaleOverallForm.get('loaiCongTrinhList').patchValue(this.loaiCongTrinhList);
  }
  trangThaiCongTrinhChange() {
    this.scaleOverallForm.get('trangthaiCongTrinhList').patchValue(this.trangthaiCongTrinhList);
  }
}
