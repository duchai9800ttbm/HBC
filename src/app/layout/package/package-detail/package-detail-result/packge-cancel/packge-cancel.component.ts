import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { PackageDetailComponent } from '../../package-detail.component';
import { ConfirmationService, AlertService } from '../../../../../shared/services';
@Component({
  selector: 'app-packge-cancel',
  templateUrl: './packge-cancel.component.html',
  styleUrls: ['./packge-cancel.component.scss']
})
export class PackgeCancelComponent implements OnInit {
  currentPackageId: number;
  constructor(
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.currentPackageId = +PackageDetailComponent.packageId;
   
  }

}
