import { Injectable } from "@angular/core";
import { SessionService } from "./session.service";
import { ApiService } from "./api.service";
import { Subject } from "rxjs/Subject";

@Injectable()
export class CallCenterHistoryService {
    private callSubject = new Subject<CallModel>();
    currentCall = this.callSubject.asObservable();
    constructor(
        private sessionService: SessionService,
        private apiService: ApiService
    ) {}

    sendCallHistory(phoneNumber: string, phoneStatus: string, time: string) {
        const callModel = new CallModel();
        callModel.phoneNumber = phoneNumber;
        callModel.phoneStatus = phoneStatus;
        callModel.startTime = time;
        this.callSubject.next(callModel);
    }
}

export class CallModel {
    phoneNumber: string;
    phoneStatus: string;
    startTime: string;
}
