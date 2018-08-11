import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Router } from '../../../../node_modules/@angular/router';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    animations: [routerTransition()]
})
export class SettingsComponent implements OnInit {
    @ViewChild('kMenuLink') menu: any;
    reasonList: any[] = [
        {
            text: 'Lý do',
            items: [
                { text: 'Lý do trúng thầu', path: '/settings/reason/win' },
                { text: 'Lý do trật thầu', path: '/settings/reason/lose' },
                { text: 'Lý do hủy thầu', path: '/settings/reason/reject' }
            ]
        }
    ];
    constructor(
        private router: Router
    ) {}

    ngOnInit() {
        // this.router.
        console.log(this.menu);
    }
}
