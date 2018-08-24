import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../../../../../node_modules/@progress/kendo-angular-dialog';
import { CreateNewInvitationComponent } from './create-new-invitation/create-new-invitation.component';
@Component({
  selector: 'app-hsdt-interview-negotiation',
  templateUrl: './hsdt-interview-negotiation.component.html',
  styleUrls: ['./hsdt-interview-negotiation.component.scss']
})
export class HsdtInterviewNegotiationComponent implements OnInit {
  dialog;
  constructor(
    private dialogService: DialogService,
  ) { }

  ngOnInit() {
  }

  createInvitation() {
      this.dialog = this.dialogService.open({
        content: CreateNewInvitationComponent,
        width: 600,
        minWidth: 250
      });
      const instance = this.dialog.content.instance;
      instance.callBack = this.closePopuup.bind(this);
  }

  closePopuup() {
    this.dialog.close();
  }

}
