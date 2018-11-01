import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { SessionService } from '.';
import { BehaviorSubject, Subject } from '../../../../node_modules/rxjs';
import { PermissionModel } from '../models/permission/permission.model';
import { UserModel } from '../models/user/user.model';

@Injectable()
export class PermissionService {

  private static permission = new BehaviorSubject<PermissionModel[]>([]);
  private static user = new BehaviorSubject<UserModel>(null);
  constructor(private apiService: ApiService) { }

  get() {
    return PermissionService.permission;
  }

  set(permission) {
    PermissionService.permission.next(permission);
  }

  getUser() {
    return PermissionService.user;
  }

  setUser(user: UserModel) {
    PermissionService.user.next(user);
  }

  getListPermission(bidOpportunityId: number) {
    const url = `bidopportunity/${bidOpportunityId}/biduserpermissions`;
    return this.apiService.get(url).map(response => response.result);
  }


}
