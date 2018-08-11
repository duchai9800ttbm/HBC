import { Component, OnInit } from '@angular/core';
import { ConfirmationService, AlertService } from '../../../../../shared/services';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-hsdt-pending',
  templateUrl: './hsdt-pending.component.html',
  styleUrls: ['./hsdt-pending.component.scss']
})
export class HsdtPendingComponent implements OnInit {
    packageId;
  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,

  ) { }

  ngOnInit() {
  }
  submited(){
    // this.router.navigate(['../../price-report-create']);
    this.confirmationService.confirm(
        'Bạn đã chắc chắn có đủ Hồ sơ dự thầu đã duyệt từ BGĐ?',
        () => {
            this.spinner.show();
            this.router.navigate([`/package/detail/${this.packageId}/attend/signed`]);
            this.spinner.hide();
            this.alertService.success("Xác nhận đã ký thành công!");
        }
    );
}
}
