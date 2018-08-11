import { Injectable } from "@angular/core";
import { UserModel } from "../models/user/user.model";
import { Subject, Observable } from "rxjs";
import { NotificationItem } from "../models/index";

@Injectable()
export class SessionService {
    private userSubject = new Subject<UserModel>();
    private avatarSubject = new Subject<string>();
    getToken(): String {
        return this.currentSession && `${this.currentSession.tokenType} ${this.currentSession.accessToken}`;
    }

    get currentUser() {
        if (!this.currentSession) {
            return null;
        }

        return {
            userId: this.currentSession.userId,
            employeeId: this.currentSession.objectId,
            userName: this.currentSession.userName
        };
    }

    get currentSession() {
        if (!window.localStorage['session']) {
            return null;
        }

        return JSON.parse(window.localStorage['session']);
    }

    saveSession(session: any) {
        window.localStorage['session'] = JSON.stringify(session);
        console.log('saveSession', session);
    }

    saveUserInfo(userInfo: UserModel) {
        this.userSubject.next(userInfo);
        window.localStorage['userInfo'] = JSON.stringify(userInfo);
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
