import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../../../../../../../shared/services';
import { HoSoDuThauService } from '../../../../../../../../shared/services/ho-so-du-thau.service';
import { CacBenLienQuan } from '../../../../../../../../shared/models/ho-so-du-thau/cac-ben-lien-quan';
import { StakeHolder } from '../../../../../../../../shared/models/ho-so-du-thau/stack-holder.model';
import { PackageComponent } from '../../../../../../package.component';
import { PackageDetailComponent } from '../../../../../package-detail.component';

@Component({
  selector: 'app-summary-condition-form-related-parties',
  templateUrl: './summary-condition-form-related-parties.component.html',
  styleUrls: ['./summary-condition-form-related-parties.component.scss']
})
export class SummaryConditionFormRelatedPartiesComponent implements OnInit {
  cacBenLienQuanForm: FormGroup;
  dataStepRelate = new CacBenLienQuan();
  stakeHolderList = Array<StakeHolder>();
  packageId;
  lienHeChuDauTuList = [];
  lienHeQuanLyDuAnList = [];
  lienHeQuanLyChiPhiList = [];
  lienHeThietKeKTList = [];
  lienHeThietKeKCList = [];
  thietKeCoDien = [];
  lienHeKhacList = [];

  mockData = [{
    id: 1,
    groupName: 'Thiết kế cơ điện',
    customers: [{
      id: 1,
      name: 'Khánh',
      note: 'abcd',
      contacts: [{
        id: 1,
        name: 'Nghĩa'
      }, {
        id: 2,
        name: 'Huy'
      }]
    },
    {
      id: 1,
      name: 'Quyền',
      note: 'abcd',
      contacts: [{
        id: 1,
        name: 'Ronaldo'
      }, {
        id: 2,
        name: 'Messi'
      }]
    }]
  },
  {
    id: 2,
    groupName: 'Thiết kế cơ',
    customers: [{
      id: 1,
      name: 'Khánh',
      note: 'ghi chú nè',
      contacts: [{
        id: 1,
        name: 'Nghĩa'
      }, {
        id: 2,
        name: 'Huy'
      }]
    }]
  }];


  constructor(
    private hoSoDuThauService: HoSoDuThauService,
    private alertService: AlertService,
    private router: Router,
    private fb: FormBuilder
  ) { }


  ngOnInit() {
    this.packageId = +PackageDetailComponent.packageId;
    this.hoSoDuThauService.getStackHolders(this.packageId).subscribe(data => {
      this.stakeHolderList = data;


      console.log(this.stakeHolderList);
    });
    this.loadData();
    this.createForm();
  }
  createForm() {
    this.cacBenLienQuanForm = this.fb.group({
      chudautu: this.fb.array([]),
      quanlyduan: this.fb.array([]),
      quanlychiphi: this.fb.array([]),
      thietkekientruc: this.fb.array([]),
      thietkeketcau: this.fb.array([]),
      thietkecodien: this.fb.array([]),
      thongtinkhac: this.fb.array([])
    });
    this.cacBenLienQuanForm.valueChanges.subscribe(data => this.hoSoDuThauService.emitDataStepRelate(data));
  }


  noteChange(e) {
     console.log(e.target.value);
     console.log(this.mockData);
  }
  loadData() {
    this.hoSoDuThauService.watchDataLiveForm().subscribe(data => {
      const objDataStepRelate = data.cacBenLienQuan;
      if (objDataStepRelate) {

      }
    });
  }


}
