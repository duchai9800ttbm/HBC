import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, AlertService } from '../../../../../shared/services';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-hsdt-signed',
  templateUrl: './hsdt-signed.component.html',
  styleUrls: ['./hsdt-signed.component.scss']
})
export class HsdtSignedComponent implements OnInit {
    packageId;

  constructor(
      private router: Router,
      private confirmationService: ConfirmationService,
      private spinner: NgxSpinnerService,
      private alertService: AlertService
  ) { }

  ngOnInit() {
  }
  submited(){
    // this.router.navigate(['../../price-report-create']);
    this.confirmationService.confirm(
        'Bạn có chắc chắn nộp HSDT?',
        () => {
            this.spinner.show();
            this.router.navigate([`/package/detail/${this.packageId}/attend/submited`]);
            this.spinner.hide();
            this.alertService.success("Nộp hồ sơ dự thầu thành công!");
        }
    );
}


}
