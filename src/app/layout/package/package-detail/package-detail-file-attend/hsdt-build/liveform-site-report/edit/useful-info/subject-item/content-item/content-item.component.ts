import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import { UsefulInfo, ContentItem } from '../../../../../../../../../../shared/models/site-survey-report/useful-info.model';
import { EditComponent } from '../../../edit.component';
import { userInfo } from 'os';

@Component({
  selector: 'app-content-item',
  templateUrl: './content-item.component.html',
  styleUrls: ['./content-item.component.scss']
})
export class ContentItemComponent implements OnInit {
  contentItemForm: FormGroup;
  contentItemImageList = [];
  url;
  @Input() contentItemModel: ContentItem;
  @Output() valueChange = new EventEmitter<ContentItem>();
  @Output() deleteContent = new EventEmitter<boolean>();
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.createForm();
    this.contentItemForm.valueChanges.subscribe(data => this.mappingData(data));
  }

  createForm() {
    this.contentItemForm = this.fb.group({
      tenNoidung: [this.contentItemModel.name],
      chiTietNoiDung: [this.contentItemModel.detail],
      chiTietNoiDungList: [this.contentItemModel.images]
    });
    this.contentItemImageList = this.contentItemModel.images;
  }

  mappingData(data) {
    const obj = new ContentItem();
    obj.name = data.tenNoidung;
    obj.detail = data.chiTietNoiDung;
    obj.images = this.contentItemImageList;
    this.valueChange.emit(obj);
  }

  // change() {
  //   const obj = new ContentItem();
  //   const valueForm = this.contentItemForm.value;
  //   obj.name = valueForm.tenNoidung;
  //   obj.detail = valueForm.chiTietNoiDung;
  //   obj.images = this.contentItemImageList;
  //   this.valueChange.emit(obj);
  // }

  uploadContentImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.contentItemImageList.push(e.target.result);
        reader.readAsDataURL(file);
      }
      this.contentItemForm.get('chiTietNoiDungList').patchValue(this.contentItemImageList);
    }
  }
  deleteContentImage(i) {
    const index = this.contentItemImageList.indexOf(i);
    this.contentItemImageList.splice(index, 1);
  }
  deleteContentItem() {
    this.deleteContent.emit(true);
  }
}
