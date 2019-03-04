import { Injectable } from "@angular/core";
import { Router, NavigationStart } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap/modal/modal";
import { ConfirmationPopupComponent } from "../components/confirmation-popup/confirmation-popup.component";
import { ConfirmationPopupCallAwayComponent } from "../components/confirmation-popup-call-away/confirmation-popup-call-away.component";
import { ResetPasswordComponent } from "../components/reset-password/reset-password.component";
import { MissActionComponent } from "../components/miss-action/miss-action.component";
import { ConfirmationHtmlPopupComponent } from "../components/confirmation-html-popup/confirmation-html-popup.component";
@Injectable()
export class ConfirmationService {
    constructor(private modalService: NgbModal) {}

    confirm(message: string, siFn: () => void) {
        // this.setConfirmation(message, siFn, noFn);
        this.openConfirmationPopup({
            type: "confirm",
            text: message,
            siFn: function() {
                siFn();
            }
        });
    }

    confirmHTML(message: any, siFn: () => void) {
        // this.setConfirmation(message, siFn, noFn);
        this.openConfirmationHTMLPopup({
            type: "confirm",
            text: message,
            siFn: function() {
                siFn();
            }
        });
    }

    // confirmAndErr(message: string, siFn: () => void, err: Function) {
    //     //  this.setConfirmation(message, siFn, noFn);
    //     this.openConfirmationPopup({
    //         type: "confirm",
    //         text: message,
    //         siFn: function() {
    //             siFn();
    //         },
    //         noFn: err
    //     });
    // }

    confirmCallAway(message: string, siFn: () => void) {
        // this.setConfirmation(message, siFn, noFn);
        this.openConfirmationPopupCallAway({
            type: "confirm",
            text: message,
            siFn: function() {
                siFn();
            }
        });
    }

    openConfirmationPopup(message) {
        const modalRef = this.modalService.open(ConfirmationPopupComponent);
        modalRef.componentInstance.message = message;
    }

    openConfirmationHTMLPopup(message) {
        const modalRef = this.modalService.open(ConfirmationHtmlPopupComponent);
        modalRef.componentInstance.message = message;
    }

    openConfirmationPopupCallAway(message) {
        const modalRef = this.modalService.open(
            ConfirmationPopupCallAwayComponent
        );
        modalRef.componentInstance.message = message;
    }

    openResetpassword(message, passreset) {
        const modalRef = this.modalService.open(
            ResetPasswordComponent
        );
        modalRef.componentInstance.message = message;
        modalRef.componentInstance.message = passreset;
    }

    missAction(message, routerLink) {
        const modalRef = this.modalService.open(
            MissActionComponent
        );
        modalRef.componentInstance.message = message;
        modalRef.componentInstance.routerLink = routerLink;
    }

}
