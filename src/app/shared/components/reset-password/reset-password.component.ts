import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '../../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../services';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  @Input() message: any;
  constructor(
    public activeModal: NgbActiveModal,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
  }

  copyPassReset(val) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.alertService.success('Mật khẩu đặt lại đã được sao chép vào khay nhớ tạm!');
  }
}
