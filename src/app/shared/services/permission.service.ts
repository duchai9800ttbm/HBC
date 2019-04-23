import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { SessionService } from '.';
import { BehaviorSubject, Subject, Observable } from '../../../../node_modules/rxjs';
import { PermissionModel } from '../models/permission/permission.model';
import { UserModel } from '../models/user/user.model';

@Injectable()
export class PermissionService {

  private static permission = new BehaviorSubject<PermissionModel[]>([]);
  private static user = new BehaviorSubject<UserModel>(null);
  constructor(
    private apiService: ApiService,
    private sessionService: SessionService
  ) { }

  private get employeeId() {
    return this.sessionService.currentUser.userId;
  }

  get() {
    return PermissionService.permission;
  }

  set(permission: PermissionModel[]) {
    PermissionService.permission.next(permission);
  }

  getUser() {
    if (!PermissionService.user.value) {
      const sub = this.getUserProfile().subscribe(result => {
        this.setUser(result);
        sub.unsubscribe();
      });
    }
    return PermissionService.user;
  }

  setUser(user: UserModel) {
    PermissionService.user.next(user);
  }

  getListPermission(bidOpportunityId: number) {
    const url = `bidopportunity/${bidOpportunityId}/biduserpermissions`;
    return this.apiService.get(url).map(response => response.result);
  }

  private getUserProfile(): Observable<UserModel> {
    const url = `/user/${this.employeeId}`;
    return this.apiService
      .get(url)
      .map(response => this.toUserModel(response.result))
      .share();
  }

  private toUserModel(result: any): UserModel {
    return {
      id: result.id,
      userName: result.userName,
      employeeId: result.employeeId,
      fullName: result.fullName,
      dateOfBirth: result.dateOfBirth,
      gender: result.gender,
      phoneNumber: result.phoneNumber,
      avatarUrl: result.avatarUrl,
      email: result.email,
      address: result.address,
      role: result.role,
      isActive: result.isActive,
      lastName: result.lastName,
      firstName: result.firstName,
      department: result.department && {
        id: result.department.key,
        text: result.department.value,
        code: result.department.code,
      },
      level: result.level && {
        id: result.level.key,
        text: result.level.value,
        code: result.level.code,
      },
      userGroup: result.userGroup && {
        id: result.userGroup.key,
        text: result.userGroup.value
      },
      avatar: result.avatar,
      privileges: result.privileges.map(x => x.value)
    };
  }

}
