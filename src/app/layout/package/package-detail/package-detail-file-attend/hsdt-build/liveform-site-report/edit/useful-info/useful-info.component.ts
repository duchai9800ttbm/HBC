import { Component, OnInit } from '@angular/core';
import { AlertService, ConfirmationService } from '../../../../../../../../shared/services';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { UsefulInfo, ContentItem } from '../../../../../../../../shared/models/site-survey-report/useful-info.model';
import { EditComponent } from '../edit.component';
import { LiveformSiteReportComponent } from '../../liveform-site-report.component';
import { Router } from '@angular/router';
import { PackageDetailComponent } from '../../../../../package-detail.component';


@Component({
  selector: 'app-useful-info',
  templateUrl: './useful-info.component.html',
  styleUrls: ['./useful-info.component.scss']
})
export class UsefulInfoComponent implements OnInit {
  usefulInfoForm: FormGroup;
  topicLists = [];
  url;
  viewMode;
  currentBidOpportunityId: number;
  usefulInfoData = [new UsefulInfo()];
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    console.log(this.usefulInfoData);
    this.currentBidOpportunityId = +PackageDetailComponent.packageId;
    this.checkFlag();
    this.initdata();
  }
  checkFlag() {
    if ((LiveformSiteReportComponent.formModel.isCreateOrEdit)) {
      const flag = LiveformSiteReportComponent.viewFlag;
      this.viewMode = flag;
      if (flag) {
        const inputs = document.getElementsByTagName('input');
        for (let i = 0; i < inputs.length; i++) {
          inputs[i].style.pointerEvents = 'none';
        }
      }
    } else {
      this.router.navigate([`/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite`]);
    }
  }
  addSubject() {
    const obj = new UsefulInfo();
    obj.content = [];
    const contObj = new ContentItem();
    contObj.imageUrls = [];
    obj.content.push(contObj);
    this.usefulInfoData.push(obj);
  }
  deleteSubject(i) {
    this.usefulInfoData.splice(i, 1);
  }

  deleteContent(index, i) {
    this.usefulInfoData[i].content.splice(index, 1);
  }
  addContent(index) {
    const obj: ContentItem = {
      name: '',
      detail: '',
      imageUrls: []
    };
    this.usefulInfoData[index].content.push(obj);
  }

  initdata() {
    const obj = LiveformSiteReportComponent.formModel.usefulInfo;
    if (obj) {
      this.usefulInfoData = obj;
    }
  }
  endPointValue(obj: UsefulInfo, index) {
    const model = this.usefulInfoData[index];
    model.title = obj.title;
    model.content = obj.content;
    LiveformSiteReportComponent.formModel.usefulInfo = [...this.usefulInfoData];
  }
}
