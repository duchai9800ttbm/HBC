import { Component, OnInit, Input } from '@angular/core';
import { PackageEmailComponent } from '../package-email.component';
import { EmailService } from '../../../../shared/services/email.service';
import { EmailItemModel, MultipeDelete, EmailFilter } from '../../../../shared/models/email/email-item.model';
import { Router } from '@angular/router';
import { ConfirmationService, AlertService } from '../../../../shared/services';
import { DialogService } from '../../../../../../node_modules/@progress/kendo-angular-dialog';
import { PrintEmailComponent } from '../../../../shared/components/print-email/print-email.component';
import { PagedResult } from '../../../../shared/models';

@Component({
  selector: 'app-email-detail',
  templateUrl: './email-detail.component.html',
  styleUrls: ['./email-detail.component.scss']
})
export class EmailDetailComponent implements OnInit {
  @Input() emailId: number;
  @Input() page: string;
  filterModel = new EmailFilter();
  pagedResult: PagedResult<EmailItemModel> = new PagedResult<EmailItemModel>();
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
  beforeId;
  afterId;
  ngOnInit() {
    this.packageId = +PackageEmailComponent.packageId;
    this.emailService.view(this.emailId).subscribe(result => {
      this.email = result;
    });
    switch (this.page) {
      case 'trash': {
        this.filterModel.category = 'TrashCan';
        break;
      }
      case 'important': {
        this.filterModel.category = 'ImportantEmails';
        break;
      }
      case 'kick-off': {
        this.filterModel.category = 'Kick-off';
        break;
      }
      case 'miss': {
        this.filterModel.category = 'AnnouncePassBidOpportunity';
        break;
      }
      case 'transfer': {
        this.filterModel.category = 'TransferDocuments';
        break;
      }
      case 'win': {
        this.filterModel.category = 'AnnouncePassBidOpportunity';
        break;
      }
      case 'interview': {
        this.filterModel.category = 'AnnounceInterview';
        break;
      }
      case 'deploy': {
        this.filterModel.category = 'AnnounceDeployment';
        break;
      }
      default: {
        break;
      }
    }
    this.emailService.searchWithFilter(this.packageId, '', this.filterModel, 0, 10000)
      .subscribe(result => {
        this.pagedResult = result;
        const curentIndex = this.pagedResult.items.findIndex(element => element.id == this.emailId);
        if (curentIndex > 0 && curentIndex < +this.pagedResult.total - 1) {
          this.beforeId = this.pagedResult.items[curentIndex + 1].id;
          this.afterId = this.pagedResult.items[curentIndex - 1].id;
          if (curentIndex == +this.pagedResult.total - 1) {
            this.beforeId = null;
            this.afterId = this.pagedResult.items[curentIndex - 1].id;
          }
        }
        if (curentIndex == 0) {
          this.afterId = null;
          if (curentIndex < +this.pagedResult.total - 1) {
            this.beforeId = this.pagedResult.items[curentIndex + 1].id;
          } else {
            this.beforeId = null;
          }
        }
      
      });


  }


  before() {
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() =>
      this.router.navigate([`package/email/${this.packageId}/${this.page}/detail`],
        {
          queryParams: { page: `${this.page}`, itemId: `${this.beforeId}` }
        }));

  }

  after() {
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() =>
      this.router.navigate([`package/email/${this.packageId}/${this.page}/detail`],
        {
          queryParams: { page: `${this.page}`, itemId: `${this.afterId}` }
        }));
  }


  download(id) {
    this.emailService.download(id).subscribe(() => { }, err => {
      this.alertService.error('File không tồn tại hoặc đã bị xóa!');
    });
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
