import { Component, OnInit } from '@angular/core';
import { PackageModel } from '../../../shared/models/package/package.model';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, ParamMap } from '../../../../../node_modules/@angular/router';
import { routerTransition } from '../../../router.animations';
import { FakePackageData } from '../../../shared/fake-data/package-data';
@Component({
  selector: 'app-package-edit',
  templateUrl: './package-edit.component.html',
  styleUrls: ['./package-edit.component.scss'],
  animations: [routerTransition()]
})
export class PackageEditComponent implements OnInit {
  // package$: Observable<PackageModel>;
  packageData = new PackageModel();
  constructor(
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {

  }

}
