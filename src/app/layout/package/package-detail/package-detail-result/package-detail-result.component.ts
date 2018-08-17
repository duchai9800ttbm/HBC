import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PackageService } from '../../../../shared/services/package.service';

@Component({
  selector: 'app-package-detail-result',
  templateUrl: './package-detail-result.component.html',
  styleUrls: ['./package-detail-result.component.scss']
})
export class PackageDetailResultComponent implements OnInit {
    public packageId;
  constructor(
      private activatedRoute: ActivatedRoute,
      private packageService: PackageService
  ) { }

  ngOnInit() {
      this.activatedRoute.params.subscribe(result => {
          this.packageId = +result.id;
      });
  }

}
