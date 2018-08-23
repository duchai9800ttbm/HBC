import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataService, SessionService, UserNotificationService } from '../../../shared/services/index';
import { Observable } from "rxjs/Observable";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangePasswordModalComponent } from '../change-password-modal/change-password-modal.component';
import { UserModel } from '../../../shared/models/user/user.model';
import { NotificationItem } from '../../../shared/models/index';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    pushRightClass = 'push-right';
    @Input() logo;
    constructor(
        private translate: TranslateService,
        private router: Router,
        private sessionService: SessionService) {

        // this.router.events.subscribe(val => {
        //     if (
        //         val instanceof NavigationEnd &&
        //         window.innerWidth <= 992 &&
        //         this.isToggled()
        //     ) {
        //         this.toggleSidebar();
        //     }
        // });
    }

    ngOnInit() {
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }



    changeLang(language: string) {
        this.translate.use(language);
    }


}
