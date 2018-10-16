import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AlertService } from '../../../../../../../shared/services';
import { HoSoDuThauService } from '../../../../../../../shared/services/ho-so-du-thau.service';

@Component({
  selector: 'app-view-detail-file',
  templateUrl: './view-detail-file.component.html',
  styleUrls: ['./view-detail-file.component.scss']
})
export class ViewDetailFileComponent implements OnInit {

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
    private hoSoDuThauService: HoSoDuThauService,
    private alertService: AlertService
  ) {

  }

  ngOnInit() {
  }

  dowloadDocument(id) {
    this.hoSoDuThauService.taiHoSoDuThau(id).subscribe(data => {
    }, err => {
      if (err.json().errorCode) {
        this.alertService.error('File không tồn tại hoặc đã bị xóa!');
      } else {
        this.alertService.error('Đã có lỗi xãy ra. Vui lòng thử lại!');
      }
    });
  }

}
