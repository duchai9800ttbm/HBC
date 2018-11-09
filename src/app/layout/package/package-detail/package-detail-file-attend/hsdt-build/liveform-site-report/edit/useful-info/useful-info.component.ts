import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UsefulInfo, ContentItem } from '../../../../../../../../shared/models/site-survey-report/useful-info.model';
import { EditComponent } from '../edit.component';
import { Router } from '@angular/router';
import { PackageDetailComponent } from '../../../../../package-detail.component';


@Component({
  selector: 'app-useful-info',
  templateUrl: './useful-info.component.html',
  styleUrls: ['./useful-info.component.scss']
})
export class UsefulInfoComponent implements OnInit, AfterViewInit {
  @ViewChild('autofocus') autofocus;
  usefulInfoForm: FormGroup;
  topicLists = [];
  url;
  currentBidOpportunityId: number;
  usefulInfoData = new Array<UsefulInfo>();
  isViewMode = false;
  imageUrlArray = [];
  indexOfImage;
  showPopupViewImage = false;
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.currentBidOpportunityId = +PackageDetailComponent.packageId;
    this.checkFlag();
    this.initData();
  }
  ngAfterViewInit() {
    if (this.usefulInfoData.length === 0 && !this.isViewMode) {
      this.autofocus.nativeElement.focus();
    }
  }

  checkFlag() {
    this.isViewMode = EditComponent.actionMode === 'info';
  }
  addSubject() {
    const obj = new UsefulInfo();
    obj.title = '';
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

  initData() {
    const obj = [...EditComponent.liveformData.usefulInfo];
    if (obj) {
      this.usefulInfoData = obj;
    } else {
      this.usefulInfoData = [];
    }
  }
  endPointValue(obj: UsefulInfo, index) {
    const model = this.usefulInfoData[index];
    model.title = obj.title;
    model.content = obj.content;
    EditComponent.liveformData.usefulInfo = [...this.usefulInfoData];
  }
  viewFullScreenImage(obj: any) {
    this.showPopupViewImage = true;
    this.imageUrlArray = [...obj.images];
    this.indexOfImage = obj.index;
  }
  closeView() {
    this.showPopupViewImage = false;
  }
}
