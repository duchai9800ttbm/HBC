import { Component, OnInit } from '@angular/core';
import { SettingService } from '../../../../shared/services/setting.service';
import { FormControl, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../../shared/services';
import { Observable } from 'rxjs';
import { DictionaryItem } from '../../../../shared/models';

@Component({
  selector: 'app-construction-items',
  templateUrl: './construction-items.component.html',
  styleUrls: ['./construction-items.component.scss']
})
export class ConstructionItemsComponent implements OnInit {
  constructionCategoryForm: FormGroup;
  paramYear: number;
  paramAction: string;
  listMainBuildingCategory: DictionaryItem[];
  yearkpi: number;
  currentYear = (new Date()).getFullYear();
  get mainBuildFA(): FormArray {
    return this.constructionCategoryForm.get('mainBuild') as FormArray;
  }
  constructor(
    private fb: FormBuilder,
    private settingService: SettingService,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private router: Router,
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
    this.dataService.getListMainConstructionComponents().subscribe(listMainBuildingCategory => {
      this.listMainBuildingCategory = listMainBuildingCategory;
      this.createForm(listMainBuildingCategory);
    });
    this.settingService.getDetailConstructionCategory(this.paramYear).subscribe(responseToYear => {
      console.log('responseToYear', responseToYear);
    });
  }

  createForm(listMainBuildingCategory) {
    console.log('listMainBuildingCategory', listMainBuildingCategory);
    this.constructionCategoryForm = this.fb.group({
      mainBuild: this.fb.array([]),
      targetTotal: null,
    });
    // let totalTarget = 0;
    (listMainBuildingCategory || []).forEach(itemMainBuild => {
      // totalTarget = totalTarget + (itemMainBuild );
      const formArrayItem = this.fb.group({
        constructionTypeId: itemMainBuild && itemMainBuild.id,
        constructionTypeName: itemMainBuild && itemMainBuild.text,
        total: 0,
        percent: 0,
        totalTarget: 0
      });
      (this.constructionCategoryForm.get('mainBuild') as FormArray).push(formArrayItem);
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
      // this.settingService.getDetailKpiLocationToYear(this.yearkpi).subscribe(responseToYear => {
      //   this.kpiLocation.removeControl('location');
      //   this.kpiLocation.addControl('location', this.fb.array([]));
      //   this.kpiLocation.removeControl('targetTotal');
      //   this.kpiLocation.addControl('targetTotal', this.fb.control(null));
      //   if (responseToYear) {
      //     const listLocation = this.handlData(responseToYear);
      //     this.createForm(listLocation);
      //   }
      //   if (!responseToYear) {
      //     return this.settingService.readLocation('', 0, 1000).subscribe(response => {
      //       this.listLocation = response.items;
      //       this.createForm(response.items);
      //     });
      //   }
      // });
    }
  }

}
