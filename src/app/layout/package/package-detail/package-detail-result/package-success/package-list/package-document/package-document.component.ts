import { Component, OnInit,Input } from '@angular/core';
import { CheckStatusPackage } from '../../../../../../../shared/constants/check-status-package';
import { PackageService } from '../../../../../../../shared/services/package.service';

@Component({
  selector: 'app-package-document',
  templateUrl: './package-document.component.html',
  styleUrls: ['./package-document.component.scss']
})
export class PackageDocumentComponent implements OnInit {
  @Input() isContract;
  statusPackage = {
    text: 'TrungThau',
    stage: 'KQDT',
    id: 24,
  };
  checkStatusPackage = CheckStatusPackage;
  constructor(
    private packageService: PackageService,
  ) { }

  ngOnInit() {
    this.packageService.statusPackageValue$.subscribe(status => {
      this.statusPackage = status;
    });
      this.isContract = false;
  }

}
