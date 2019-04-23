import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UsefulInfo, ContentItem } from '../../../../../../../../../shared/models/site-survey-report/useful-info.model';
import { PackageDetailComponent } from '../../../../../../package-detail.component';
import { Router } from '@angular/router';
import { EditComponent } from '../../edit.component';

@Component({
  selector: 'app-subject-item',
  templateUrl: './subject-item.component.html',
  styleUrls: ['./subject-item.component.scss']
})
export class SubjectItemComponent implements OnInit {
  @Input() usefulInfo: UsefulInfo;
  @Output() watchingChild = new EventEmitter<UsefulInfo>();
  @Output() addContentItem = new EventEmitter<boolean>();
  @Output() deleteContent = new EventEmitter<number>();
  @Output() deleteSubjectEmit = new EventEmitter<boolean>();
  @Output() listImages = new EventEmitter<any>();

  isViewMode = false;
  currentBidOpportunityId: number;

  subjectList = [
    'Quy mô tổng quan công trình',
    'Mô tả tổng quát công trường',
    'Giao thông và lối vào công trường',
    'Phá vỡ và gia cố ',
    'Dịch vụ cơ điện phục vụ thi công',
    'Điều kiện đất nền hiện hữu'
  ];
  constructor(private router: Router) { }

  ngOnInit() {
    this.currentBidOpportunityId = +PackageDetailComponent.packageId;
    this.checkFlag();
  }
  checkFlag() {
    this.isViewMode = EditComponent.actionMode === 'info';
  }

  addContent() {
    this.addContentItem.emit(true);
  }

  selectedChange() {
    this.watchingChild.emit(this.usefulInfo);
  }
  trackingChange(obj: ContentItem, index) {
    const model = this.usefulInfo.content[index];
    model.name = obj.name;
    model.imageUrls = obj.imageUrls;
    model.detail = obj.detail;
    this.watchingChild.emit(this.usefulInfo);
  }
  deleteContentItem(index) {
    this.deleteContent.emit(index);
    if (!this.usefulInfo.content.length) {
      this.deleteSubject();
    }
  }
  deleteSubject() {
    this.deleteSubjectEmit.emit(true);
  }
  viewFullScreenImage(obj: any) {
    this.listImages.emit(obj);
  }
}
