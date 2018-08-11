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
        private callCenterHistory: CallCenterHistoryService
    ) { }
    isCollapsedCall = false;
    isCollapsedCallAway = true;
    isCollapsedAudit = false;
    userInfo: UserModel;
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
    getListPhoneNumberIsCall() {
        this.callCenter.getCallNumbers().subscribe(result => {
            for (let i = 0; i < result.length; i++) {
                for (let j = i + 1; j < result.length; j++) {
                    if (result[i].callernumber === result[j].callernumber) {
                        result.splice(i, 1);
                    }
                }
            }

            this.listPhoneNumber = result;
            this.listPhoneCall.emit(this.listPhoneNumber);

            this.callCenter.getCallNumbersHistory().subscribe(res => {
                let list = [];
                list = res;
                if (list.length) {
                    this.listPhoneNumber.forEach(e => {
                        list.unshift(e);
                    });
                }
                this.listPhoneNumberHistory = list.slice(0, 5);
                this.listPhoneNumberHistory.forEach(e => {
                    if (e.callStatus === "DialAnswer") {
                        e.title = "Đang trả lời";
                    }
                    if (e.callStatus === "Start") {
                        e.title = "Đang gọi";
                    }
                    if (
                        e.callStatus !== "DialAnswer" &&
                        e.callStatus !== "Start"
                    ) {
                        e.title = "Đã gọi";
                    }
                });
                if (list && list.length && this.dem === 0) {
                    this.isCollapsedAudit = true;
                    this.isCollapsedCall = false;
                    this.dem++;
                }
                if (!list && !list.length) {
                    this.dem = 0;
                }
            });
        });
    }
    getListPhoneCallAway() {
        this.callCenter.getCallNumbersAway().subscribe(result => {
            this.listPhoneNumberHistoryAway = result;
            this.listPhoneNumberHistoryAway.forEach(e => {
                if (e.callStatus === "DialAnswer") {
                    e.title = "Đang trả lời";
                }
                if (e.callStatus === "Start") {
                    e.title = "Đang gọi";
                }
                if (e.callStatus !== "DialAnswer" && e.callStatus !== "Start") {
                    e.title = "Đã gọi";
                }
            });
        });
    }
    sendCallNumber(sdt, status, time) {
        this.emitPhoneCall.emit(sdt);
        this.emitPhoneStatus.emit(status);

        this.callCenterHistory.sendCallHistory(sdt, status, time);
    }
    eventCalled() {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = "0";
        } else {
            this.showMenu = element;
        }
    }
    toggleCol1() {
        this.isCollapsedCall = !this.isCollapsedCall;
        if (this.isCollapsedCall === true) {
            this.isCollapsedAudit = false;
            this.isCollapsedCallAway = true;
        } else {
            this.isCollapsedAudit = true;
            this.isCollapsedCallAway = true;
        }
    }
    toggleCol2() {
        this.isCollapsedCallAway = !this.isCollapsedCallAway;
        if (this.isCollapsedCallAway === true) {
            this.isCollapsedAudit = true;
            this.isCollapsedCall = false;
        } else {
            this.isCollapsedAudit = true;
            this.isCollapsedCall = true;
        }
    }
    toggleCol3() {
        this.isCollapsedAudit = !this.isCollapsedAudit;
        if (this.isCollapsedAudit === true) {
            this.isCollapsedCall = false;
            this.isCollapsedCallAway = true;
        } else {
            this.isCollapsedCall = true;
            this.isCollapsedCallAway = true;
        }
    }

    toggleSidebar() {
        this.toggleMenuFromSidebar.emit();
    }
}
