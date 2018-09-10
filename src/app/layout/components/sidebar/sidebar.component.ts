import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { AuditItem, PagedResult } from "../../../shared/models/index";
import {
    AuditService,
    SessionService,
    UserService
} from "../../../shared/services/index";
import { UserModel } from "../../../shared/models/user/user.model";
import { CallCenterService } from "../../../shared/services/call-center.service";
import { CallCenterHistoryService } from "../../../shared/services/call-center-history.service";
import { slideInOut } from "../../../router.animations";
import { LayoutService } from "../../../shared/services/layout.service";

@Component({
    selector: "app-sidebar",
    templateUrl: "./sidebar.component.html",
    styleUrls: ["./sidebar.component.scss"],
    animations: [slideInOut()],

})
export class SidebarComponent implements OnInit {
    abc = "aaaa";
    isActive = false;
    showMenu = "";
    dem = 0;
    avatarSrc: string;
    listPhoneNumber = [];
    listPhoneNumberHistory = [];
    listPhoneNumberHistoryAway = [];
    audits$: Observable<AuditItem[]>;
    audits: any[];
    pagedResult: PagedResult<AuditItem>;
    @Input() state;

    constructor(
        private auditService: AuditService,
        private sessionService: SessionService,
        private userService: UserService,
        private callCenter: CallCenterService,
        private callCenterHistory: CallCenterHistoryService,
        private layoutService: LayoutService
    ) { }
    isCollapsedCall = false;
    isCollapsedCallAway = true;
    isCollapsedAudit = false;
    userInfo: UserModel;
    showSidebarContent = false;
    @Output() emitPhoneCall: EventEmitter<string> = new EventEmitter<string>();
    @Output()
    emitPhoneStatus: EventEmitter<string> = new EventEmitter<string>();
    @Output() listPhoneCall: EventEmitter<any> = new EventEmitter<any>();
    @Output() toggleMenuFromSidebar: EventEmitter<any> = new EventEmitter<any>();
    ngOnInit(): void {
        // this.auditService.getAudits(0, 5).subscribe(pagedResult => {
        //     this.pagedResult = pagedResult;
        //     this.audits = pagedResult.items;
        //     this.audits.forEach(element => {
        //         if (element.id) {
        //             this.userService
        //                 .getAvatarByUserId(element.id)
        //                 .subscribe(result => {
        //                     element.avatar = result.avatar
        //                         ? `data:image/jpeg;base64,${result.avatar}`
        //                         : null;
        //                 });
        //         } else {
        //             element.avatar = null;
        //         }
        //     });
        // });

        // IntervalObservable.create(3000).subscribe(() => {
        //     this.getListPhoneNumberIsCall();
        //     this.getListPhoneCallAway();
        // });

    }
    toggleSidebar() {
        const width = document.getElementById('sidebar').offsetWidth;
        const widthScreen = window.screen.width;
        if (widthScreen > 992) {
            if (width === 55) {
                this.toggleMenuFromSidebar.emit(false);
                this.layoutService.emitEvent(false);
                this.showSidebarContent = false;

            } if (width === 200) {
                this.toggleMenuFromSidebar.emit(true);
                this.layoutService.emitEvent(true);
                this.showSidebarContent = true;
                document.getElementById('logo').setAttribute('Width', '200');
            }
        }

    }

    // onResize(e) {
    //     const width = document.getElementById('sidebar').offsetWidth;
    //     if (width < 200) {
    //         // document.getElementById('logo').setAttribute('Width', '55');
    //         this.toggleMenuFromSidebar.emit(false);
    //         this.layoutService.emitEvent(false);
    //         this.showSidebarContent = false;
    //     }
    //     if (width === 200) {
    //         this.toggleMenuFromSidebar.emit(true);
    //         this.layoutService.emitEvent(true);
    //         this.showSidebarContent = true;
    //         document.getElementById('logo').setAttribute('Width', '200');
    //     }
    // }
}
