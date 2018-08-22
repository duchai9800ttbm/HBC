import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-hsdt-build',
    templateUrl: './hsdt-build.component.html',
    styleUrls: ['./hsdt-build.component.scss']
})
export class HsdtBuildComponent implements OnInit {
    isChangeIcon = true;
    isHidden = false;
    constructor() { }

    ngOnInit() {
    }
    toggleClick() {
        this.isChangeIcon = !this.isChangeIcon;
        this.isHidden = !this.isHidden;
    }
}
