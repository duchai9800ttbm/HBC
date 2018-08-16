import { ListUserItem } from '../../shared/models/user/user-list-item.model';
import { Injectable, OnInit } from '@angular/core';
// import { Subject } from 'rxjs';
import { Observable, BehaviorSubject } from 'rxjs';
import { PagedResult } from '../models/paging-result.model';
import { ApiService, SessionService } from '.';
import { InstantSearchService } from './instant-search.service';
import { GroupUserResponse } from '../models/api-response/user/group-user/group-user-response.model';
import { GroupUserRequest } from '../models/api-request/user/group-user/group-user-request.model';
import { GroupUserPrivilegesRequest } from '../models/api-request/user/group-user/group-user-privileges-request.model';
import { GroupUserList } from '../models/user/group-user-list-item';
import { ListAllGroupUser } from '../models/user/list-all-groupuser';
@Injectable()
export class GroupUserService implements OnInit {
  // User
  private static toListUserItem(result: any): ListUserItem {
    return {
      id: result.id,
      userName: result.userName,
      email: result.email,
      department: result.department && {
        key: result.department.key,
        value: result.department.value
      },
      level: result.level && {
        key: result.level.key,
        value: result.level.value
      },
      firstName: result.firstName,
      lastName: result.lastName,
      userGroup: result.userGroup && {
        id: result.userGroup.id,
        name: result.userGroup.name,
        desc: result.userGroup.desc,
        isActive: result.userGroup.isActive,
        privilegeUserGroups: result.userGroup.privilegeUserGroups && [{
          key: result.userGroup.privilegeUserGroups.key,
          value: result.userGroup.privilegeUserGroups.value
        }]
      },
      isActive: result.isActive,
      phoneNumber: result.phoneNumber,
      address: result.address,
    };
  }
  // GroupUser
  private static toListGroupUserItem(result: any): GroupUserList {
    return {
      id: result.id,
      name: result.name,
      desc: result.desc,
      isActive: result.isActive,
      checkbox: null,
      notPrivileges: [],
      privileges: result.privileges.map(itemPrivilege => {
        return {
          id: itemPrivilege.key,
          text: itemPrivilege.value,
        };
      })
    };
  }
  constructor(
    private apiService: ApiService,
    private instantSearchService: InstantSearchService
  ) { }


  ngOnInit() {
  }
  // getdataGroupUser(page: number, pageSize: number): Observable<PagedResult<ListUserItem>> {
  //   const url = `user/${page}/${pageSize}`;
  //   return this.apiService.get(url)
  //     .map(data => {
  //       const result = data.result;
  //       return {
  //         currentPage: result.pageIndex,
  //         pageSize: pageSize,
  //         pageCount: result.totalPages,
  //         total: result.totalCount,
  //         items: (result.items || []),
  //       };
  //     });
  // }
  getdataGroupUser(
    page: number | string,
    pageSize: number | string
  ): Observable<PagedResult<ListUserItem>> {
    const that = this;
    return that.apiService
      .get(`user/${page}/${pageSize}`)
      .map(response => {
        return {
          currentPage: response.result.pageIndex,
          pageSize: pageSize,
          pageCount: response.result.totalPages,
          total: response.result.totalCount,
          items: response.result.items
        };
      })
      .share();
  }

  getIdUser(id: number | string): Observable<any> {
    const url = `user/${id}`;
    return this.apiService.get(url)
      .map(data => {
        const result = data.result;
        return {
          id: result.id,
          userName: result.userName,
          email: result.email,
          department: result.department && {
            key: result.department.key,
            value: result.department.value
          },
          level: result.level && {
            key: result.level.key,
            value: result.level.value
          },
          firstName: result.firstName,
          lastName: result.lastName,
          userGroup: result.userGroup && {
            id: result.userGroup.id,
            name: result.userGroup.name,
            desc: result.userGroup.desc,
            isActive: result.userGroup.isActive,
            privileges: result.userGroup.privileges && [{
              key: result.userGroup.privileges.key,
              value: result.userGroup.privileges.value
            }]
          },
          isActive: result.isActive,
          phoneNumber: result.phoneNumber,
          address: result.address,
        };
      });
  }


  // active/deactive user
  activeOrDeactiveUser(id: number, active: boolean): Observable<any> {
    const url = active ? `user/${id}/deactive` : `user/${id}/active`;
    return this.apiService.post(url, {
      'id': id
    }).map(data => data.result);
  }

  getListAccounts(id: number): Observable<any> {
    const url = `user/${id}`;
    return this.apiService.get(url)
      .map(data => {
        return data.result;
      });
  }
  // xóa 1 user
  deleteUser(id: number | string) {
    const url = `user/delete`;
    return this.apiService
      .post(url, {
        id: id
      })
      .map(data => data.result);
  }


  createOrUpdateUser(data): Observable<any> {
    console.log('tạo mới/update', data);
    const url = data.id ? `user/edit` : `user/create`;
    console.log('url', url);
    return this.apiService.post(url, data)
      .map(data => data.result);
  }

  // Search
  searchKeyWord(
    terms: Observable<string>,
    page: number | string,
    pageSize: number | string
  ): Observable<PagedResult<ListUserItem>> {
    const searchUrl = `user/${page}/${pageSize}?searchTerm=`;
    return this.instantSearchService.search(
      searchUrl,
      terms
    )
      .map(result => {
        return {
          currentPage: result.pageIndex,
          pageSize: result.pageSize,
          pageCount: result.totalPages,
          total: result.totalCount,
          items: result.items,
        };
      });
  }
  // Xóa nhiều người dùng
  deleteMulti(arrayIdUser: any): Observable<any> {
    const url = `user/delete-multi`;
    return this.apiService.post(url, arrayIdUser);
  }
  // Thay đổi nhóm của User
  changeGroupUser(userId: number, groupId: number): Observable<any> {
    const url = `user/${userId}/groups/${groupId}`;
    return this.apiService.post(url);
  }


  // User group
  // Danh sách tất cả các nhóm người dùng
  getListAllGroupUser(): Observable<ListAllGroupUser[]> {
    const url = `usergroup/getall`;
    return this.apiService.get(url)
      .map(response => {
        const result = response.result;
        return result.map(item => {
          return {
            id: item.id,
            name: item.name,
            desc: item.desc,
            isActive: item.isActive,
            privileges: item.privileges.map(e => {
              return {
                id: e.key,
                text: e.value,
              };
            })
          };
        });
      });
  }
  // Danh sách nhóm người dùng phân trang
  listGroupUser(page: number | string, pageSize: number | string): Observable<PagedResult<GroupUserList[]>> {
    const url = `usergroup/getall/${page}/${pageSize}`;
    return this.apiService.get(url)
      .map(response => {
        const result = response.result;
        return {
          currentPage: result.pageIndex,
          pageSize: result.pageSize,
          pageCount: result.totalPages,
          total: result.totalCount,
          items: (result.items || []).map(GroupUserService.toListGroupUserItem),
        };
      });
  }
  // Tìm kiềm nhóm người dùng
  searchGroupUser(searchTerm: string,
    page: number | string, pageSize: number | string): Observable<PagedResult<GroupUserList[]>> {
    const filterUrl = `usergroup/filter/${page}/${pageSize}?searchTerm=${searchTerm}`;
    return this.apiService.get(filterUrl).map(response => {
      const result = response.result;
      return {
        currentPage: result.pageIndex,
        pageSize: result.pageSize,
        pageCount: result.totalPages,
        total: result.totalCount,
        items: (result.items || []).map(GroupUserService.toListGroupUserItem),
      };
    });
  }
  // Tìm kiềm nhóm người dùng (Observable)
  instantSearchGroupUser(searchTerms: Observable<string>,
    page: number | string, pageSize: number | string): Observable<PagedResult<GroupUserList[]>> {
    const searchUrl = `usergroup/filter/${page}/${pageSize}?searchTerm=`;
    return this.instantSearchService.search(searchUrl, searchTerms).map(response => {
      const result = response;
      return {
        currentPage: result.pageIndex,
        pageSize: result.pageSize,
        pageCount: result.totalPages,
        total: result.totalCount,
        items: (result.items || []).map(GroupUserService.toListGroupUserItem),
      };
    });
  }
  // Thêm mới nhóm người dùng
  createGroupUser(inforGroupUser: GroupUserRequest): Observable<GroupUserResponse> {
    const url = `usergroup/create`;
    const requestModel = {
      name: inforGroupUser.userGroupName,
      privilegeIds: inforGroupUser.privileges.map(i => Number(i.id)),
      isActive: true,
    };
    console.log('requestModel', requestModel);
    return this.apiService.post(url, requestModel)
      .map(response => {
        const result = response.result;
        return {
          id: result.id,
          name: result.name,
          desc: result.desc,
          isActive: result.isActive,
          privileges: result.privileges.map(privileges => {
            return {
              id: privileges.key,
              text: privileges.value,
            };
          })
        };
      });
  }
  // Xóa nhiều nhóm người dùng
  deleteListGroupUser(listIdGroupUser: any): Observable<any> {
    const url = `usergroup/delete`;
    return this.apiService.post(url, listIdGroupUser);
  }
  // Cập nhật danh sách chức năng của nhóm người dùng
  changePrivilegesGroupUser(listPrivilegesUpdate: GroupUserPrivilegesRequest): Observable<any> {
    const url = `usergroup/changeprivileges`;
    return this.apiService.post(url, listPrivilegesUpdate);
  }
  // Kích hoạt nhóm người dùng
  activateUser(idGroupUser: number): Observable<any> {
    const url = `usergroup/${idGroupUser}/activate`;
    return this.apiService.post(url);
  }
  // Khóa nhóm người dung
  deactiveUser(idGroupUser: number): Observable<any> {
    const url = `usergroup/${idGroupUser}/deactive`;
    return this.apiService.post(url);
  }
  // Chỉnh sửa nhóm người dùng
  editGroupUser(groupUser: any): Observable<any> {
    console.log('groupUser', groupUser);
    const url = `usergroup/edit`;
    return this.apiService.post(url, groupUser);
  }
  // // Tìm kiếm nhóm người dung theo tên
  // searchGroupUser(
  //   terms: Observable<string>,
  //   page: number | string,
  //   pageSize: number | string
  // ): Observable<PagedResult<ListUserItem>> {
  //   const searchUrl = `usergroup/filter/${page}/${pageSize}?searchTerm=`;
  //   return this.instantSearchService.search(
  //     searchUrl,
  //     terms
  //   )
  //     .map(result => {
  //       return {
  //         currentPage: result.pageIndex,
  //         pageSize: result.pageSize,
  //         pageCount: result.totalPages,
  //         total: result.totalCount,
  //         items: result.items,
  //       };
  //     });
  // }
}

