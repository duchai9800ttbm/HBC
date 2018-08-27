
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DialogService } from '../../../../../../../node_modules/@progress/kendo-angular-dialog';
import { UploadFileHsdtComponent } from './upload-file-hsdt/upload-file-hsdt.component';
import { PackageService } from '../../../../../shared/services/package.service';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { PackageDetailComponent } from '../../package-detail.component';
@Component({
    selector: 'app-hsdt-build',
    templateUrl: './hsdt-build.component.html',
    styleUrls: ['./hsdt-build.component.scss']
})
export class HsdtBuildComponent implements OnInit {
    dialog;
    packageId;
    isShowMenu = false;
    constructor(
        private dialogService: DialogService,
        private packageService: PackageService,
        private cdr: ChangeDetectorRef,
        private router: Router
    ) { }
    notShow = false;
    ngOnInit() {
        this.packageId = +PackageDetailComponent.packageId;
        this.packageService.isSummaryConditionForm$.subscribe(data => {
            this.isShowMenu = data;
            this.cdr.detectChanges();
        });

        this.router.events.subscribe((val) => {
            this.notShow = this.isActive();
        });
    }

    toggleClick() {
        $('.toggle-menu-item').toggleClass('resize');
        // setTimeout( () => ($('.toggle-menu-item').toggleClass('hidden')), 2100);
        $('.iconN1').toggleClass('iconN01');
        $('.iconN2').toggleClass('iconN02');
        $('.iconN3').toggleClass('iconN03');
        console.log('ok');
    }

    showDialogUploadFile(name: string) {
        this.dialog = this.dialogService.open({
            content: UploadFileHsdtComponent,
            width: 493,
            minWidth: 250
        });
        const instance = this.dialog.content.instance;
        instance.nameFile = name;
        instance.callBack = this.closePopuup.bind(this);
    }

    closePopuup() {
        this.dialog.close();
    }


    isActive(): boolean {
        return this.router.isActive(`/package/detail/${this.packageId}/attend/build/sitereport`, true);
    }
}
