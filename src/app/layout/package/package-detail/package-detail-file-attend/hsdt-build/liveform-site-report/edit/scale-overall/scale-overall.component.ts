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

  loaiCongTrinhList = [
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

  trangthaiCongTrinhList = [
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
  perspectiveImageUrls = [];
  structureImageUrls = [];
  requirementsImageUrls = [];
  url;
  scaleModel = new ScaleOverall();
  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initData();
    console.log(EditComponent.formModel.scaleOverall);
    this.scaleOverallForm = this.fb.group({
      tenTaiLieu: [this.scaleModel.tenTaiLieu],
      lanPhongVan: [this.scaleModel.lanPhongVan],
      loaiCongTrinhList: [this.scaleModel.loaiCongTrinh],
      trangthaiCongTrinhList: this.trangthaiCongTrinhList,
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
      this.scaleModel.loaiCongTrinh = obj.loaiCongTrinh ? obj.loaiCongTrinh : this.loaiCongTrinhList;
      this.trangthaiCongTrinhList = this.trangthaiCongTrinhList;
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
    EditComponent.formModel.scaleOverall.loaiCongTrinh = this.loaiCongTrinhList; // TODO mapping
    EditComponent.formModel.scaleOverall.trangthaiCongTrinh = this.trangthaiCongTrinhList;
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
