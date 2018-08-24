import { Component, OnInit, Input } from '@angular/core';
import { PackageEmailComponent } from '../package-email.component';
import { EmailService } from '../../../../shared/services/email.service';
import { EmailItemModel, MultipeDelete } from '../../../../shared/models/email/email-item.model';
import { Router } from '@angular/router';
import { ConfirmationService, AlertService } from '../../../../shared/services';
import { DialogService } from '../../../../../../node_modules/@progress/kendo-angular-dialog';
import { PrintEmailComponent } from '../../../../shared/components/print-email/print-email.component';

@Component({
  selector: 'app-email-detail',
  templateUrl: './email-detail.component.html',
  styleUrls: ['./email-detail.component.scss']
})
export class EmailDetailComponent implements OnInit {
  @Input() emailId: number;
  @Input() page: string;
  constructor(
    private emailService: EmailService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private alertService: AlertService,
    private dialogService: DialogService,
  ) { }
  packageId;
  dialog;
  email: EmailItemModel;
  ngOnInit() {
    this.packageId = +PackageEmailComponent.packageId;
    this.emailService.view(this.emailId).subscribe(result => {
      this.email = result;
    });
  }

  download(id) {
    this.emailService.download(id).subscribe();
  }

  delete() {
    const that = this;
    const obj = new MultipeDelete();
    obj.ids = [this.emailId];
    this.confirmationService.confirm(
      'Bạn có chắc chắn muốn xóa tài liệu này?',
      () => {
        this.emailService.moveToTrash(obj).subscribe(data => {
          that.alertService.success('Đã xóa email thành công!');
          that.emailService.emitEvent();
          that.router.navigate([`package/email/${this.packageId}/${this.page}/list`]);
        });
      }
    );
  }

  print() {
    this.dialog = this.dialogService.open({
      title: 'EMAIL',
      content: PrintEmailComponent,
      width: 600,
      minWidth: 250
    });
    const instance = this.dialog.content.instance;
    instance.emailId = this.emailId;
    instance.callBack = () => this.back();
  }

  back() {
    this.router.navigate([`package/email/${this.packageId}/${this.page}/list`]);
  }
}
