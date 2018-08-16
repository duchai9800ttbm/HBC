import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { PackageDetailComponent } from '../../package-detail.component';
@Component({
  selector: 'app-packge-cancel',
  templateUrl: './packge-cancel.component.html',
  styleUrls: ['./packge-cancel.component.scss']
})
export class PackgeCancelComponent implements OnInit {
  currentPackageId: number;
  constructor() { }

  ngOnInit() {
    this.currentPackageId = +PackageDetailComponent.packageId;
  }

}
