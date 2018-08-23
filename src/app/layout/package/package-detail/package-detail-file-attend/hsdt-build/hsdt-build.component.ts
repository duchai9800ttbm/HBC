import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PackageService } from '../../../../../shared/services/package.service';

@Component({
    selector: 'app-hsdt-build',
    templateUrl: './hsdt-build.component.html',
    styleUrls: ['./hsdt-build.component.scss']
})
export class HsdtBuildComponent implements OnInit {
    isShowMenu = false;
    constructor(
        private packageService: PackageService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.packageService.isSummaryConditionForm$.subscribe(data => {
            this.isShowMenu = data;
            this.cdr.detectChanges();
        });
    }

    toggleClick() {
        $('.toggle-menu-item').toggleClass('resize');
        $('.iconN1').toggleClass('iconN01');
        $('.iconN2').toggleClass('iconN02');
        $('.iconN3').toggleClass('iconN03');
        console.log('ok');
    }
}
