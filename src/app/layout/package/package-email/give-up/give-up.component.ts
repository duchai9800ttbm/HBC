import { Component, OnInit } from '@angular/core';
import { Subject } from '../../../../../../node_modules/rxjs/Subject';
import { DATATABLE_CONFIG } from '../../../../shared/configs/datatable.config';
import { EmailItemModel } from '../../../../shared/models/email/email-item.model';

@Component({
  selector: 'app-give-up',
  templateUrl: './give-up.component.html',
  styleUrls: ['./give-up.component.scss']
})
export class GiveUpComponent implements OnInit {

  checkboxSeclectAll: boolean;
  listEmail: EmailItemModel[];

  constructor() {
    this.listEmail = [{
      id: 1,
      senderEmployee: {
        employeeId: 2,
        employeeName: 'Nguyễn Hữu Nghĩa'
      },
      from: 'nghia.nguyen@bys.vn',
      to: 'Khánh Kyo',
      subject: 'Email tham gia',
      sentDate: 1534750633,
      content: '',
      isSuccess: true,
      isImportant: true,
      emailAttatchments: [{
        id: 2,
        fileName: 'tailieu.docx'
      }]
    },
    {
      id: 2,
      senderEmployee: {
        employeeId: 2,
        employeeName: 'Nguyễn Khánh Huy'
      },
      from: 'khanh.huy@bys.vn',
      to: 'Hoàng Duy Khánh',
      subject: 'Email từ chối',
      sentDate: 1534750853,
      content: '',
      isSuccess: true,
      isImportant: false,
      emailAttatchments: []
    }];
  }
  ngOnInit() {
  }

  changeImportant(id) {

  }

  onSelectAll(value: boolean) {
  }
}
