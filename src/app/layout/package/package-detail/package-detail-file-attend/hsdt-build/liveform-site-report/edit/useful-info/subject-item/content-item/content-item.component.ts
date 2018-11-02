import { Component, OnInit, Output, Input, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import { ContentItem } from '../../../../../../../../../../shared/models/site-survey-report/useful-info.model';
import { LiveformSiteReportComponent } from '../../../../liveform-site-report.component';
import { PackageDetailComponent } from '../../../../../../../package-detail.component';
import { AlertService } from '../../../../../../../../../../shared/services';
import { SiteSurveyReportService } from '../../../../../../../../../../shared/services/site-survey-report.service';

@Component({
  selector: 'app-content-item',
  templateUrl: './content-item.component.html',
  styleUrls: ['./content-item.component.scss']
})
export class ContentItemComponent implements OnInit, AfterViewInit {
  @ViewChild('uploadContent') uploadContent;
  @ViewChild('autofocus') autofocus;
  @Input() contentItemModel: ContentItem;
  @Output() valueChange = new EventEmitter<ContentItem>();
  @Output() deleteContent = new EventEmitter<boolean>();
  contentItemForm: FormGroup;
  contentItemImageList = [];
  deleteImageList = [];
  imageUrlArray = [];
  indexOfImage;
  showPopupViewImage = false;
  currentBidOpportunityId: number;
  isViewMode = false;

  constructor(
    private siteSurveyReportService: SiteSurveyReportService,
    private alertService: AlertService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.currentBidOpportunityId = +PackageDetailComponent.packageId;
    this.checkFlag();
    this.createForm();
    this.contentItemForm.valueChanges.subscribe(data => this.mappingData(data));
  }
  ngAfterViewInit() {
    if (!this.isViewMode) {
      this.autofocus.nativeElement.focus();
    }
  }
  checkFlag() {
    this.isViewMode = LiveformSiteReportComponent.actionMode === 'viewMode';
  }

  createForm() {
    this.contentItemForm = this.fb.group({
      tenNoidung: [this.contentItemModel.name],
      chiTietNoiDung: [this.contentItemModel.detail],
      chiTietNoiDungList: [this.contentItemModel.imageUrls]
    });
    this.contentItemImageList = this.contentItemModel.imageUrls;
  }

  mappingData(data) {
    const obj = new ContentItem();
    obj.name = data.tenNoidung;
    obj.detail = data.chiTietNoiDung;
    obj.imageUrls = this.contentItemImageList;
    this.valueChange.emit(obj);
  }
  uploadContentImage(event) {
    const files = event.target.files;
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
      .subscribe(res => {
        this.contentItemImageList = [...this.contentItemImageList, ...res];
        this.contentItemForm.get('chiTietNoiDungList').patchValue(this.contentItemImageList);
        this.uploadContent.nativeElement.value = null;
      }, err => {
        this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
        this.contentItemImageList.forEach(x => {
          if (!x.id) {
            const index = this.contentItemImageList.indexOf(x);
            this.contentItemImageList.splice(index, 1);
          }
        });
      });
  }
  deleteContentImage(i) {
    const index = this.contentItemImageList.indexOf(i);
    if (i.guid) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.guid).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.contentItemImageList.splice(index, 1);
    this.contentItemForm.get('chiTietNoiDungList').patchValue(this.contentItemImageList);
  }
  deleteContentItem() {
    this.deleteContent.emit(true);
  }

  viewFullScreenImage(listImage, indexImage?) {
    this.showPopupViewImage = true;
    this.imageUrlArray = [...listImage];
    this.indexOfImage = indexImage;
  }
  closeView() {
    this.showPopupViewImage = false;
  }
}
