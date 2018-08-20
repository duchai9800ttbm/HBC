import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '../../../../../../node_modules/@angular/router';
import { PackageDetailComponent } from '../package-detail.component';
import { FakePackageData } from '../../../../shared/fake-data/package-data';
import { PackageModel } from '../../../../shared/models/package/package.model';

@Component({
  selector: 'app-package-detail-info',
  templateUrl: './package-detail-info.component.html',
  styleUrls: ['./package-detail-info.component.scss']
})
export class PackageDetailInfoComponent implements OnInit {
  // currentPackageId: number;
  // packageData = new PackageModel();
  constructor(
    private activatedRoute: ActivatedRoute
  ) { }
  ngOnInit() {
    // this.currentPackageId = +PackageDetailComponent.packageId;
    // FakePackageData.forEach( i => {
    //   if ( i.id === this.currentPackageId ) {
    //     this.packageData = i;
    //   }
    // });
  }

}
