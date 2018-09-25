import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import { UsefulInfo, ContentItem } from '../../../../../../../../../../shared/models/site-survey-report/useful-info.model';
import { EditComponent } from '../../../edit.component';
import { userInfo } from 'os';
import { LiveformSiteReportComponent } from '../../../../liveform-site-report.component';
import { Router } from '@angular/router';
import { PackageDetailComponent } from '../../../../../../../package-detail.component';
import { AlertService } from '../../../../../../../../../../shared/services';
import { SiteSurveyReportService } from '../../../../../../../../../../shared/services/site-survey-report.service';

@Component({
  selector: 'app-content-item',
  templateUrl: './content-item.component.html',
  styleUrls: ['./content-item.component.scss']
})
export class ContentItemComponent implements OnInit {
  @Input() contentItemModel: ContentItem;
  @Output() valueChange = new EventEmitter<ContentItem>();
  @Output() deleteContent = new EventEmitter<boolean>();
  contentItemForm: FormGroup;
  contentItemImageList = [];
  deleteImageList = [];
  currentBidOpportunityId: number;
  viewMode;

  constructor(
    private siteSurveyReportService: SiteSurveyReportService,
    private alertService: AlertService,
    private fb: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit() {
    this.currentBidOpportunityId = +PackageDetailComponent.packageId;
    this.checkFlag();
    this.createForm();
    this.contentItemForm.valueChanges.subscribe(data => this.mappingData(data));
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
  uploadContentImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        if (file.size < 10485760) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.contentItemImageList.push({
              id: null,
              image: {
                file: file,
                base64: e.target.result
              }
            });
            this.contentItemForm.get('chiTietNoiDungList').patchValue(this.contentItemImageList);
          };
          reader.readAsDataURL(file);
        } else {
          this.alertService.error(`Hình ảnh ${file.name} quá lớn! Vui lòng chọn hình ảnh khác`);
        }
      }
    }
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(this.contentItemImageList, this.currentBidOpportunityId)
      .subscribe(res => {
        this.contentItemImageList = res;
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
    if (i.id) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.id).subscribe(res => {

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
}
