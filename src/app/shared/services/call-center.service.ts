import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { SessionService, ApiService } from ".";
import { element } from "protractor";
import { Subject } from "rxjs/Subject";
import {
    DialogService,
    DialogRef,
    DialogCloseResult
} from "@progress/kendo-angular-dialog";

@Injectable()
export class CallCenterService {
    callSubject = new Subject<string>();
    currentCall = this.callSubject.asObservable();

    constructor(
        private sessionService: SessionService,
        private apiService: ApiService
    ) { }

    getCallNumbers(): Observable<any[]> {
        const url = `/employee/${
            this.sessionService.currentUser.employeeId
            }/callcenter/callnumbers`;
        return this.apiService
            .get(url)
            .map(response => {
                const result = response.result;
                const currentCalls = result.currentCalls;
                const historyCalls = result.historyCalls;
                return currentCalls.map(item => {
                    return {
                        callStatus: item && item.callStatus,
                        callUuid: item && item.callUuid,
                        callernumber:
                            item &&
                            (item.direction === null
                                ? item.destinationnumber.substring(1)
                                : item.callernumber),
                        starttime: null,
                        destinationnumber: item && item.destinationnumber,
                        direction: item && item.direction
                    };
                });
            })
            .share();
    }

    getCallNumbersAway(): Observable<any[]> {
        const url = `/employee/${
            this.sessionService.currentUser.employeeId
            }/callcenter/callnumbers/outbound`;
        return this.apiService
            .get(url)
            .map(response => {
                return response.result.map(item => {
                    return {
                        callStatus: item && item.callStatus,
                        callUuid: item && item.callUuid,
                        callernumber:
                            item && item.destinationnumber.substring(1),
                        starttime: item && item.starttime,
                        destinationnumber: item && item.destinationnumber,
                        direction: item && item.direction
                    };
                });
            })
            .share();
    }

    getCallNumbersHistory(): Observable<any[]> {
        const url = `/employee/${
            this.sessionService.currentUser.employeeId
            }/callcenter/callnumbers`;
        return this.apiService
            .get(url)
            .map(response => {
                const result = response.result;
                const historyCalls = result.historyCalls;
                return historyCalls.map(item => {
                    return {
                        callStatus: "",
                        callUuid: item && item.callUuid,
                        callernumber:
                            item &&
                            (item.direction === null
                                ? item.destinationnumber.substring(1)
                                : item.callernumber),
                        starttime: item && item.starttime,
                        destinationnumber: item && item.destinationnumber,
                        direction: item && item.direction
                    };
                });
            })
            .share();
    }

    getObjectInfoByCallNumber(number: string): Observable<any> {
        const url = `/employee/${
            this.sessionService.currentUser.employeeId
            }/phone/${number}`;
        return this.apiService
            .get(url)
            .map(response => {
                const result = response.result;
                return result.map(item => {
                    return {
                        objectName: item && item.objectName,
                        objectAddress: item && item.objectAddress,
                        objectType: item && item.objectType,
                        objectId: item && item.objectId,
                        objectEmail: item && item.objectEmail,
                        objectCompany: item && item.objectCompany,
                        objectOwing: item && item.owing
                    };
                });
            })
            .share();
    }

    call(sdt) {
        const url = `makecall2.php?callernum=202&destnum=${sdt}&secrect=52cb7e9b9b0d23462f6d8c24b3cc27ad&version=3`;
        return this.apiService
            .getNoHeader(url)
            .map(response => response)
            .share();
    }
}
