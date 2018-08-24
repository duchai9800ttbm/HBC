import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../../../../../node_modules/@progress/kendo-angular-dialog';
import { UploadFileHsdtComponent } from './upload-file-hsdt/upload-file-hsdt.component';
@Component({
    selector: 'app-hsdt-build',
    templateUrl: './hsdt-build.component.html',
    styleUrls: ['./hsdt-build.component.scss']
})
export class HsdtBuildComponent implements OnInit {
    dialog;
    constructor(
        private dialogService: DialogService,
    ) { }

    ngOnInit() {
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
}
