import { Component, OnInit, ViewChild } from '@angular/core';
import { PackageDetailComponent } from '../../package-detail.component';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../../../../../shared/services';
import { OpportunityHsmtService } from '../../../../../shared/services/opportunity-hsmt.service';
import { EmailModel } from '../../../../../shared/models/email/email.model';

@Component({
  selector: 'app-send-mail-reject',
  templateUrl: './send-mail-reject.component.html',
  styleUrls: ['./send-mail-reject.component.scss']
})
export class SendMailRejectComponent implements OnInit {
  name = 'ng2-ckeditor';
  ckeConfig: any;
  mycontent: string;
  log = '';
  packageId;
  items = ['nghia.nguyen@bys.vn'];
  subject = '';
  @ViewChild('myckeditor') ckeditor: any;
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private opportunityHsmt: OpportunityHsmtService
  ) {
    this.mycontent = ``;
  }
  ckEditorConfig =
    {
      'toolbarGroups': [
        { name: 'basicstyles', groups: ['basicstyles'] },
        { name: 'paragraph', groups: ['list', 'align', 'paragraph'] },
        { name: 'styles' },
        { name: 'colors' },
        { name: 'font' },
        { name: 'links' },

      ],
      'removeButtons': `Save,Templates,Find,Replace,Scayt,SelectAll,Underline,Subscript,Superscript,SpecialChar,Anchor,Unlink`
    };
  ngOnInit() {
    this.packageId = +PackageDetailComponent.packageId;

  }
  onChange($event: any): void {
  }
  goRejectionLetter() {
    this.router.navigate([`/package/detail/${this.packageId}/invitation/rejection-letter`]);
  }

  sendMail() {
    const email = new EmailModel();
    email.bidOpportunityId = this.packageId;
    email.content = this.mycontent;
    email.subject = this.subject;
    email.recipientEmails = this.items;
    this.spinner.show();
    this.opportunityHsmt.refuseMessage(email).subscribe(result => {
      this.spinner.hide();
      this.router.navigate([`/package/detail/${this.packageId}/invitation/rejection-letter`]);
    });

  }
}
