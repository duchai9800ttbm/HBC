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
        if (!window.localStorage['session']) {
            return null;
        }

        return JSON.parse(window.localStorage['session']);
    }

    get currentUserInfo() {
        if (!window.localStorage['userInfo']) {
            return null;
        }

        return JSON.parse(window.localStorage['userInfo']);
    }

    saveSession(session: any) {
        window.localStorage['session'] = JSON.stringify(session);
    }

    saveUserInfo(userInfo: UserModel) {
        this.userSubject.next(userInfo);
        window.localStorage['userInfo'] = JSON.stringify(userInfo);
    }

    saveAvatarUser(userInfo: UserModel) {
        this.avatarUserSubject.next(userInfo);
        window.localStorage['userInfo'] = JSON.stringify(userInfo);
    }
    watchAvatarUser(): Observable<UserModel> {
        return this.avatarUserSubject;
    }

    saveAvatarContact(avatarString: string) {
        this.avatarSubject.next(avatarString);
        window.localStorage['avatarContact'] = avatarString;
    }

    getAvatarContact(): Observable<string> {
        return this.avatarSubject.asObservable();
    }

    getUserInfo(): Observable<UserModel> {
        return this.userSubject.asObservable();
    }

    get userInfo(): UserModel {
        if (!window.localStorage["userInfo"]) {
            return new UserModel();
        }

        return JSON.parse(window.localStorage["userInfo"]);
    }

    destroySession() {
        window.localStorage.clear();
    }

    set branchId(id: number) {
        window.localStorage["branchId"] = id;
    }

    get branchId(): number {
        return window.localStorage["branchId"];
    }
}
