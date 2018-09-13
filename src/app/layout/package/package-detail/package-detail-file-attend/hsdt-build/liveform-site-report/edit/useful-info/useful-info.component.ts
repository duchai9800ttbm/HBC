import { Component, OnInit } from '@angular/core';
import { AlertService, ConfirmationService } from '../../../../../../../../shared/services';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { UsefulInfo, ContentItem } from '../../../../../../../../shared/models/site-survey-report/useful-info.model';
import { EditComponent } from '../edit.component';


@Component({
  selector: 'app-useful-info',
  templateUrl: './useful-info.component.html',
  styleUrls: ['./useful-info.component.scss']
})
export class UsefulInfoComponent implements OnInit {
  usefulInfoForm: FormGroup;
  topicLists = [];
  url;
  usefulInfoData: UsefulInfo[];
  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.initdata();
  }
  addSubject() {
    const obj = new UsefulInfo();
    obj.content = [];
    const contObj = new ContentItem();
    contObj.images = [];
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
      images: []
    };
    this.usefulInfoData[index].content.push(obj);
  }

  initdata() {
    const obj = EditComponent.formModel.usefulInfo;
    if (obj) {
      this.usefulInfoData = obj;
    }
  }
  endPointValue(obj: UsefulInfo, index) {
    const model = this.usefulInfoData[index];
    model.title = obj.title;
    model.content = obj.content;
    EditComponent.formModel.usefulInfo = [...this.usefulInfoData];
  }
}
