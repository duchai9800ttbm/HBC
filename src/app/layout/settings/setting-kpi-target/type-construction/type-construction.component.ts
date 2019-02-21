import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { SettingService } from '../../../../shared/services/setting.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DictionaryItem } from '../../../../shared/models';
import { DataService, AlertService } from '../../../../shared/services';

@Component({
  selector: 'app-type-construction',
  templateUrl: './type-construction.component.html',
  styleUrls: ['./type-construction.component.scss']
})
export class TypeConstructionComponent implements OnInit {
  constructionTypeForm: FormGroup;
  paramYear: number;
  paramAction: string;
  yearkpi: number;
  currentYear = (new Date()).getFullYear();
  listBuildingProjectType: DictionaryItem[];
  get typeBuilddFA(): FormArray {
    return this.constructionTypeForm.get('typeBuild') as FormArray;
  }
  constructor(
    private fb: FormBuilder,
    private settingService: SettingService,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private router: Router,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.paramAction = params['action'];
      this.paramYear = params['year'];
    });
    if (this.paramYear) {
      this.yearkpi = this.paramYear;
    } else {
      this.yearkpi = this.currentYear;
    }
    this.settingService.getDetailConstructionType(this.yearkpi).subscribe(responseToYear => {
      if (responseToYear) {
        this.createForm(responseToYear);
      }
      if (!responseToYear) {
        this.dataService.getListConstructonTypes().subscribe(listBuildingProjectType => {
          this.listBuildingProjectType = listBuildingProjectType;
          this.createForm(listBuildingProjectType);
        });
      }
    });
  }

  createForm(listBuildingProjectType) {
    console.log('listBuildingProjectType', listBuildingProjectType);
    this.constructionTypeForm = this.fb.group({
      typeBuild: this.fb.array([]),
      targetTotal: null,
    });
    let totalTarget = 0;
    (listBuildingProjectType || []).forEach(itemTypeBuild => {
      totalTarget = totalTarget + (itemTypeBuild.totalTarget ? itemTypeBuild.totalTarget : 0);
      const formArrayItem = this.fb.group({
        constructionTypeId: itemTypeBuild && itemTypeBuild.id,
        constructionTypeName: itemTypeBuild.text ||
          (itemTypeBuild.constructionType && itemTypeBuild.constructionType.constructionTypeName),
        totalAmount: itemTypeBuild.totalAmount,
        percent: itemTypeBuild.percent,
        totalTargetAmount: itemTypeBuild.totalTargetAmount,
      });
      (this.constructionTypeForm.get('typeBuild') as FormArray).push(formArrayItem);
    });
    this.constructionTypeForm.get('targetTotal').patchValue(totalTarget);
  }

  createOrEditConstructionType() {
    this.settingService.createOrEditConstructionType(this.yearkpi, this.constructionTypeForm.get('typeBuild').value)
      .subscribe(response => {
        if (this.paramAction === 'create') {
          this.router.navigate(
            [],
            {
              relativeTo: this.activatedRoute,
              queryParams: { action: 'view', year: this.yearkpi },
            });
          this.alertService.success('Tạo mới chỉ tiêu kpi loại công trình thành công');
        }
        if (this.paramAction === 'edit') {
          this.router.navigate(
            [],
            {
              relativeTo: this.activatedRoute,
              queryParams: { action: 'view', year: this.yearkpi },
            });
          this.alertService.success('Chỉnh sửa chỉ tiêu kpi loại công trình thành công');
        }
      }, err => {
        if (this.paramAction === 'create') {
          this.alertService.error('Đã xảy lỗi. Tạo mới chỉ tiêu kpi loại công trình không thành công.');
        }
        if (this.paramAction === 'edit') {
          this.alertService.error('Đã xảy lỗi. Tạo mới chỉ tiêu kpi loại công trình không thành công.');
        }
      });
  }

  changeYearTargetFuc() {
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: { action: this.paramAction, year: this.yearkpi },
      });
    if (this.paramAction === 'view') {
      this.settingService.getDetailConstructionType(this.yearkpi).subscribe(responseToYear => {
        this.constructionTypeForm.removeControl('typeBuild');
        this.constructionTypeForm.addControl('typeBuild', this.fb.array([]));
        this.constructionTypeForm.removeControl('targetTotal');
        this.constructionTypeForm.addControl('targetTotal', this.fb.control(null));
        if (responseToYear) {
          this.createForm(responseToYear);
        }
        if (!responseToYear) {
          this.dataService.getListConstructonTypes().subscribe(listBuildingProjectType => {
            this.listBuildingProjectType = listBuildingProjectType;
            this.createForm(listBuildingProjectType);
          });
        }
      });
    }
  }

  calculTargetTotal(indexForm: number) {
    const totalTarget = this.typeBuilddFA.controls[indexForm].get('totalAmount').value *
      this.typeBuilddFA.controls[indexForm].get('percent').value / 100;
    this.typeBuilddFA.controls[indexForm].get('totalTargetAmount').patchValue(totalTarget);
    let totalTargetAll = 0;
    (this.typeBuilddFA.value || []).forEach(itemFormTypeBuild => {
      totalTargetAll = totalTargetAll + itemFormTypeBuild.totalTarget;
    });
    this.constructionTypeForm.get('targetTotal').patchValue(totalTargetAll);
  }
}
