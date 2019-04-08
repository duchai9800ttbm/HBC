import { Component, OnInit, Output, Input, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContentItem } from '../../../../../../../../../../shared/models/site-survey-report/useful-info.model';
import { PackageDetailComponent } from '../../../../../../../package-detail.component';
import { AlertService } from '../../../../../../../../../../shared/services';
import { SiteSurveyReportService } from '../../../../../../../../../../shared/services/site-survey-report.service';
import { EditComponent } from '../../../edit.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-content-item',
  templateUrl: './content-item.component.html',
  styleUrls: ['./content-item.component.scss']
})
export class ContentItemComponent implements OnInit, OnDestroy {
  @ViewChild('uploadContent') uploadContent;
  @Input() contentItemModel: ContentItem;
  @Output() valueChange = new EventEmitter<ContentItem>();
  @Output() deleteContent = new EventEmitter<boolean>();
  @Output() listImages = new EventEmitter<any>();
  contentItemForm: FormGroup;
  contentItemImageList = [];
  currentBidOpportunityId: number;
  isViewMode = false;
  subscription: Subscription;

  constructor(
    private siteSurveyReportService: SiteSurveyReportService,
    private alertService: AlertService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.currentBidOpportunityId = +PackageDetailComponent.packageId;
    this.checkFlag();
    const loadingData$ = this.siteSurveyReportService.watchingSignalLoad().subscribe(signal => {
      this.checkFlag();
      this.createForm();
      loadingData$.unsubscribe();
    });
    this.subscription = this.siteSurveyReportService.watchingSignalEdit().subscribe(signal => {
      this.isViewMode = !signal;
      if (this.isViewMode && this.contentItemForm) {
        this.contentItemForm.disable();
      }
      if (!this.isViewMode && this.contentItemForm) {
        this.contentItemForm.enable();
      }
      this.checkFlag();
      this.createForm();
      this.checkFlag();
    });
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  checkFlag() {
    this.isViewMode = EditComponent.actionMode === 'info';
  }

  createForm() {
    this.contentItemForm = this.fb.group({
      tenNoidung: [this.contentItemModel.name],
      chiTietNoiDung: [this.contentItemModel.detail],
      chiTietNoiDungList: [this.contentItemModel.imageUrls]
    });
    this.contentItemImageList = this.contentItemModel.imageUrls;
    if (this.isViewMode && this.contentItemForm) {
      this.contentItemForm.disable();
    }
    if (!this.isViewMode && this.contentItemForm) {
      this.contentItemForm.enable();
    }
    this.contentItemForm.valueChanges.subscribe(data => this.mappingData(data));
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
    document.getElementById('uploadContentLoading').classList.add('loader');
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
      .subscribe(res => {
        document.getElementById('uploadContentLoading').classList.remove('loader');
        this.contentItemImageList = [...this.contentItemImageList, ...res];
        this.contentItemForm.get('chiTietNoiDungList').patchValue(this.contentItemImageList);
        this.uploadContent.nativeElement.value = null;
      }, err => {
        document.getElementById('uploadContentLoading').classList.remove('loader');
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
    const obj = {
      images: listImage,
      index: indexImage
    };
    this.listImages.emit(obj);
  }

  onFocus(e) {
    const input = e.target.parentNode.firstElementChild;
    e.target.addEventListener('keyup', elem => {
      if (elem.keyCode === 13) {
        input.click();
      }
    });
  }
}
