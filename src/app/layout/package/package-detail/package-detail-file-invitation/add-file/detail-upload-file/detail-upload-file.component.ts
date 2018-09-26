import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BidDocumentGroupModel } from '../../../../../../shared/models/document/bid-document-group.model';
import { DocumentService } from '../../../../../../shared/services/document.service';
import { AlertService } from '../../../../../../shared/services';

@Component({
  selector: 'app-detail-upload-file',
  templateUrl: './detail-upload-file.component.html',
  styleUrls: ['./detail-upload-file.component.scss']
})
export class DetailUploadFileComponent implements OnInit {

  @Output() closed = new EventEmitter<boolean>();
  @Input() model: any;
  @Input() currentMajorType;

  file;
  icon = `<i class="fa fa-search" aria-hidden="true"></i>`;
  public events: string[] = [];

  public close() {
    this.closed.emit(false);
  }

  constructor(
    private spinner: NgxSpinnerService,
    private documentService: DocumentService,
    private alertService: AlertService
  ) {

  }

  ngOnInit() {
  }

  dowloadDocument(id) {
    this.documentService.download(id).subscribe(data => {
    }, err => {
        if (err.json().errorCode) {
            this.alertService.error('File không tồn tại hoặc đã bị xóa!');
        } else {
            this.alertService.error('Đã có lỗi xãy ra!');
        }
    });
}

}
