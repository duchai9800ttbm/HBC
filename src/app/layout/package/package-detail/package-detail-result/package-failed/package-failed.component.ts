import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-package-failed',
  templateUrl: './package-failed.component.html',
  styleUrls: ['./package-failed.component.scss']
})
export class PackageFailedComponent implements OnInit {
  bidDocumentReviewListItemSearchResult: any = [
    { id: 1, bidReviewDocumentName: 'Tài liệu cung cấp vật tư',bidReviewDocumentVersion:1,bidReviewDocumentStatus:'',employeeName:'Oliver Dinh',bidReviewDocumentUploadDate:'01/01/2018',interview:1},
    { id: 2, bidReviewDocumentName: 'Tài liệu cung cấp giấy tờ liên quan',bidReviewDocumentVersion:1.1,bidReviewDocumentStatus:'',employeeName: 'Van Dinh',bidReviewDocumentUploadDate:'02/02/2018',interview:1}
  ];
  constructor() { }

  ngOnInit() {
  }

}
