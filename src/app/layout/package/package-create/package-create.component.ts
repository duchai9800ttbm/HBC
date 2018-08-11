import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { PackageModel } from '../../../shared/models/package/package.model';
import { ActivatedRoute } from '../../../../../node_modules/@angular/router';
@Component({
    selector: 'app-package-create',
    templateUrl: './package-create.component.html',
    styleUrls: ['./package-create.component.scss'],
    animations: [routerTransition()]
})
export class PackageCreateComponent implements OnInit {
    packageModel = new PackageModel();
    constructor(
        private activatedRoute: ActivatedRoute,
    ) {
    }

    ngOnInit() {
    }

}
