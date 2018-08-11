import { Component, OnInit } from '@angular/core';
import { GroupUserModel } from '../../../../shared/models/user/group-user.model';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { GroupUserService } from '../../../../shared/services/group-user.service'

@Component({
  selector: 'app-manage-user-list',
  templateUrl: './manage-user-list.component.html',
  styleUrls: ['./manage-user-list.component.scss']
})
export class ManageUserListComponent implements OnInit {

  public mySelection: number[] = [];
  public pageSize = 10;
  public skip = 0;
  total: number;
  groups: Array<{ name: string; id: number }> = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Nhóm lưu trữ' }
  ];
  constructor(private groupUserService: GroupUserService) {

  }

  ngOnInit() {

  };



}
