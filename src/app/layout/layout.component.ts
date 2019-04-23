import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import * as moment from 'moment';
import { AlertService } from '../shared/services/index';
import { TranslateService } from '@ngx-translate/core';
import { delay } from 'rxjs/operator/delay';
import { ScrollToTopService } from '../shared/services/scroll-to-top.service';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    constructor(
        private router: Router,
        private alertService: AlertService,
        private translateService: TranslateService,
        private scrollToTopService: ScrollToTopService,
    ) {
        this.clientHeight = window.innerHeight - 110;
    }
    sdt;
    status;
    listSdt;
    clientHeight: number;
    menuState = 'out';
    logo = false;
    ngOnInit() {
        // disable datatable error alerts
        $.fn.dataTable.ext.errMode = 'none';

        if (this.router.url === '/' || this.router.url === '/#/') {
            this.router.navigate(['/dashboard']);
        }
        
        this.scrollToTopService.listen();
    }

    receive(sdt) {
        this.sdt = sdt;
    }
    receive2(status) {
        this.status = status;
    }
    receiveListPhone(list) {
        this.listSdt = list;
    }
    sectionIn() {
        const dom: Element = document.getElementById('main-container');
        dom.classList.add('sectionIn');
        dom.classList.remove('sectionOut');
    }
    sectionOut() {
        const dom: Element = document.getElementById('main-container');
        dom.classList.remove('sectionIn');
        dom.classList.add('sectionOut');
    }
    toggleMenu(e) {
        // 1-line if statement that toggles the value:
        const dom: Element = document.getElementById('main-container');
        this.menuState = this.menuState === 'out' ? 'in' : 'out';
        this.menuState === 'out' ? this.sectionIn() : this.sectionOut();
        if (e) {
            this.logo = true;

        } else {
            this.logo = false;
        }
    }
}
