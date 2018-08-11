import { Injectable } from "@angular/core";
import { Router, NavigationStart } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap/modal/modal";
import { ConfirmationPopupComponent } from "../components/confirmation-popup/confirmation-popup.component";
import { ConfirmationPopupCallAwayComponent } from "../components/confirmation-popup-call-away/confirmation-popup-call-away.component";

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

    openConfirmationPopupCallAway(message) {
        const modalRef = this.modalService.open(
            ConfirmationPopupCallAwayComponent
        );
        modalRef.componentInstance.message = message;
    }
}
