import { Injectable } from "@angular/core";
import { UserModel } from "../models/user/user.model";
import { Subject, Observable } from "rxjs";
import { NotificationItem } from "../models/index";

@Injectable()
export class SessionService {
    private userSubject = new Subject<UserModel>();
    private avatarSubject = new Subject<string>();
    private avatarUserSubject = new Subject<UserModel>();
    getToken(): String {
        return this.currentSession && `${this.currentSession.tokenType} ${this.currentSession.accessToken}`;
    }

    get currentUser() {
        if (!this.currentSession) {
            return null;
        }

        return {
            userId: this.currentSession.userId,
            employeeId: this.currentSession.employeeId,
            userName: this.currentSession.userName,
            fullName: `${this.currentSession.firstName} ${this.currentSession.lastName}`
        };
    }

    get currentSession() {
        if (!window.localStorage['tender_session']) {
            return null;
        }

        return JSON.parse(window.localStorage['tender_session']);
    }

    saveSession(session: any) {
        window.localStorage['tender_session'] = JSON.stringify(session);
    }

    get currentUserInfo() {
        if (!window.localStorage['tender_userInfo']) {
            return null;
        }

        return JSON.parse(window.localStorage['tender_userInfo']);
    }

    saveUserInfo(userInfo: UserModel) {
        this.userSubject.next(userInfo);
        window.localStorage['tender_userInfo'] = JSON.stringify(userInfo);
    }

    saveAvatarUser(userInfo: UserModel) {
        this.avatarUserSubject.next(userInfo);
        window.localStorage['tender_userInfo'] = JSON.stringify(userInfo);
    }

    watchAvatarUser(): Observable<UserModel> {
        return this.avatarUserSubject;
    }

    saveAvatarContact(avatarString: string) {
        this.avatarSubject.next(avatarString);
        window.localStorage['tender_avatarContact'] = avatarString;
    }

    getAvatarContact(): Observable<string> {
        return this.avatarSubject.asObservable();
    }

    getUserInfo(): Observable<UserModel> {
        return this.userSubject.asObservable();
    }

    get userInfo(): UserModel {
        if (!window.localStorage['tender_userInfo']) {
            return new UserModel();
        }

        return JSON.parse(window.localStorage['tender_userInfo']);
    }

    destroySession() {
        window.localStorage.removeItem('tender_user');
        window.localStorage.removeItem('tender_userInfo');
        window.localStorage.removeItem('tender_branchId');
        window.localStorage.removeItem('tender_avatarContact');
        window.localStorage.removeItem('tender_session');
    }

    set branchId(id: number) {
        window.localStorage['tender_branchId'] = id;
    }

    get branchId(): number {
        return window.localStorage['tender_branchId'];
    }
}
