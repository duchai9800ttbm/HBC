import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HoSoDuThauService } from '../../../../../../../../shared/services/ho-so-du-thau.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../../../../../../shared/services';
import { ThongTinDuAn } from '../../../../../../../../shared/models/ho-so-du-thau/tom-tat-dkdt.model';

@Component({
  selector: 'app-summary-condition-form-info',
  templateUrl: './summary-condition-form-info.component.html',
  styleUrls: ['./summary-condition-form-info.component.scss']
})
export class SummaryConditionFormInfoComponent implements OnInit {
  thongTinDuAnForm: FormGroup;
  hinhAnhPhoiCanhList = [];
  banVeMasterPlanList = [];
  dataStepInfo = new ThongTinDuAn();

  constructor(
    private hoSoDuThauService: HoSoDuThauService,
    private alertService: AlertService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loadData();
    this.createForm();
    this.thongTinDuAnForm.valueChanges.subscribe(data => this.hoSoDuThauService.emitDataStepInfo(data));
  }
  createForm() {
    this.thongTinDuAnForm = this.fb.group({
      tenTaiLieu: this.dataStepInfo.tenTaiLieu,
      hinhAnhPhoiCanh: [],
      banVeMasterPlan: [],
      lanPhongVan: this.dataStepInfo.lanPhongVan,
      thongTinDuAn: this.dataStepInfo.dienGiaiThongTinDuAn
    });
  }
  loadData() {
    this.hoSoDuThauService.watchDataLiveForm().subscribe(data => {
      const objDataStepInfo = data.thongTinDuAn;
      if (objDataStepInfo) {
        this.dataStepInfo.tenTaiLieu = objDataStepInfo.tenTaiLieu;
        this.dataStepInfo.lanPhongVan = objDataStepInfo.lanPhongVan;
        this.hinhAnhPhoiCanhList = objDataStepInfo.hinhAnhPhoiCanh;
        this.banVeMasterPlanList = objDataStepInfo.banVeMasterPlan;
        this.dataStepInfo.dienGiaiThongTinDuAn = objDataStepInfo.dienGiaiThongTinDuAn;
      }
    });
  }
}
