import { Component, OnInit, Input } from '@angular/core';
import { SendEmailModel } from '../../../../../../../shared/models/send-email-model';
import { EmailService } from '../../../../../../../shared/services/email.service';

@Component({
  selector: 'app-notification-contract',
  templateUrl: './notification-contract.component.html',
  styleUrls: ['./notification-contract.component.scss']
})
export class NotificationContractComponent implements OnInit {
  @Input() callBack: Function;
  emailModel: SendEmailModel = new SendEmailModel();
  ckeConfig: any;
  isSendCc = false;
  isSendBcc = false;
  file;
  listEmailSearchTo;
  listEmailSearchCc;
  listEmailSearchBcc;
  constructor(
    private emailService: EmailService,
  ) { }

  ngOnInit() {
    this.ckeConfig = {
      toolbar: [
        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike'] },
        { name: 'justify', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
        { name: 'styles', items: ['Styles', 'Format', 'FontSize', '-', 'TextColor', 'BGColor'] },
        { name: 'insert', items: ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe'] },
        { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'Undo', 'Redo'] },
      ],
      allowedContent: true,
      extraPlugins: 'colorbutton,font,justify,print,tableresize,pastefromword,liststyle,autolink,uploadimage',
      pasteFromWord_inlineImages: true,
      forcePasteAsPlainText: false,
    };
    this.emailService.searchbymail('').subscribe(response => {
      this.listEmailSearchTo = response;
      this.listEmailSearchCc = response;
      this.listEmailSearchBcc = response;
    });
  }
  closePopup() {
    this.callBack();
  }
  sendCc() {
    this.isSendCc = !this.isSendCc;
  }
  sendBcc() {
    this.isSendBcc = !this.isSendBcc;
  }
  uploadfile(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      for (let i = 0; i < fileList.length; i++) {
        this.file.push(fileList[i]);
      }
      event.target.value = null;
    }
  }
}
