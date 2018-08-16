import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { ApiService } from './api.service';
import { SessionService } from './session.service';
import { UserModel } from '../models/user/user.model';
import { PagedResult } from '../models/paging-result.model';
import { UserItemModel } from '../models/user/user-item.model';

@Injectable()
export class UserService {
    constructor(
        private apiService: ApiService,
        private sessionService: SessionService
    ) { }
    get employeeId() {
        return this.sessionService.currentUser.userId;
    }

    get getUserId() {
        return this.sessionService.currentUser.userId;

    }

    private static toUserModel(result: any): UserModel {
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
            },
            level: result.level && {
                id: result.level.key,
                text: result.level.value
            },
            userGroup: result.userGroup && {
                id: result.userGroup.key,
                text: result.userGroup.value
            },
            avatar: result.avatar,
            privileges: result.privileges.map(x => x.value)
        };
    }

    setAuth(session: any) {
        this.sessionService.saveSession(session);
        this.getUserProfile().subscribe(result =>
            this.sessionService.saveUserInfo(result)
        );
    }

    purgeAuth() {
        this.sessionService.destroySession();
    }

    attemptAuth(type, username, password): Observable<any> {
        const route = type === 'login' ? 'login' : '';
        return this.apiService
            .postAuth(route, {
                userName: username,
                password: password
            })
            .map(data => {
                this.setAuth(data.result);
                return data.result;
            });
    }

    changePassword(
        oldPassword: string,
        newPassword: string
    ): Observable<any> {
        return this.apiService
            .post('/user/password/change', {
                currentPassword: oldPassword,
                newPassword: newPassword
            })
            .map(data => {
                return data;
            });
    }

    getActiveCode(email: string): Observable<any> {
        const url = `password/forgot`;
        return this.apiService
            .post(url, {
                email: email
            })
            .map(data => {
                return data.result;
            });
    }

    // validateActiveCode(recoverCode: string): Observable<any> {
    //     const url = `/users/password/validate?token=${recoverCode}`;
    //     return this.apiService.get(url).map(data => {
    //         return data.result;
    //     });
    // }

    validateActiveCode(recoverCode: string, email: string): Observable<any> {
        const url = `password/validateactivecode`;
        // ${recoverCode}
        return this.apiService.post(url, {
            email: email,
            activeCode: recoverCode
        }).map(data => {
            return data.result;
        });
    }

    // deleteEmail() {
    //     this.email = '';
    // }

    resetPassword(email: string, recoverCode: string, newPassword: string): Observable<any> {
        const url = `password/reset`;
        // console.log('this.email', this.email);
        return this.apiService
            .post(url, {
                email: email,
                token: recoverCode,
                password: newPassword
            })
            .map(data => {
                return data.result;
            });
    }

    logOut(): Observable<any> {
        return this.apiService.post('/logout').map(data => {
            return data;
        });
    }

    // updateUserProfile(formValue: any): Observable<UserModel> {
    //   const url = `/employee/${this.employeeId}/edit`;
    //   return this.apiService.post(url, formValue)
    //     .map(response => {
    //       return {
    //         firstName: response.result.firstName,
    //         lastName: response.result.lastName,
    //         fullName: `${response.result.lastName} ${response.result.firstName}`,
    //         phone: response.result.phone,
    //         dob: response.result.dob,
    //         email: response.result.email,
    //         address: response.result.address,
    //         gender: response.result.gender,
    //       };
    //     });
    // }

    getUserProfile(): Observable<UserModel> {
        const url = `/user/${this.employeeId}`;
        return this.apiService
            .get(url)
            .map(response => UserService.toUserModel(response.result))
            .share();
    }

    /////////////////////////////////////////////////

    // Chi tiết thông tin người dùng
    getUserInformation(id: number): Observable<UserModel> {
        const url = `user/${id}`;
        return this.apiService
            .get(url)
            .map(response => UserService.toUserModel(response.result))
            .share();
    }
    // CHi tiết người dùng hiện tại
    getUserLoginInformation(): Observable<UserModel> {
        const url = `user/me`;
        return this.apiService
            .get(url)
            .map(response => UserService.toUserModel(response.result))
            .share();
    }
    // Tìm kiếm người dùng theo họ tên
    searchUser(page: number, pageSize: number, searchTerm: string): Observable<PagedResult<UserModel>> {
        const url = `user/search/${page}/${pageSize}?searchTerm=${searchTerm}`;
        return this.apiService
            .get(url)
            .map(result => {
                return {
                    currentPage: result.pageIndex,
                    pageSize: result.pageSize,
                    pageCount: result.totalPages,
                    total: result.totalCount,
                    items: (result.items || []).map(UserService.toUserModel),
                };
            })
            .share();
    }
    // Thêm người dùng mới
    addNewUser(formValue: UserModel) {
        const url = `user/create`;
        return this.apiService.post(url, formValue)
            .map(response => UserService.toUserModel(response.result))
            .share();
    }
    // Cập nhật avatar
    // upLoadAvatar(avatar: string): Observable<any> {
    //     const url = `user/me/updateavatar`;
    //     return this.apiService
    //         .post(url, { avatar: avatar })
    //         .map(response => UserService.toUserModel(response.result))
    //         .share();
    // }

    upLoadAvatar(avatar: File): Observable<any> {
        const url = `user/me/updateavatar`;
        const formData = new FormData();
        formData.append('ImageFiles', avatar);
        return this.apiService.postFile(url, formData)
            .map(response => response)
            .share();
    }

    getAvatarByUserId(id: number | string) {
        const url = `employee/${this.employeeId}/avatar/${id}`;
        return this.apiService
            .get(url)
            .map(response => response.result)
            .share();
    }
    // danh sách tất cả người dùng
    getAllUser(searchTerm: string): Observable<UserItemModel[]> {
        const url = `user/search/?searchTerm=${searchTerm}`;
        return this.apiService.get(url)
            .map(response => response.result).share();
    }

    searchListUser(searchTerm: string): Observable<any> {
        const url = `user/search/?searchTerm=${searchTerm}`;
        return this.apiService.get(url)
            .map(response => {
                return response.result.map(x => {
                    return {
                        id: x.employeeId,
                        text: x.employeeName,
                    };
                });
            })
            .share();
    }
    // Lọc người dùng (theo vai trò)
    getListUser(
        roles: string,
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<UserModel>> {
        const url = `user/user/${page}/${pageSize}`;
        return this.apiService.post(url, roles)
            .map(response => {
                const result = response.result;
                return {
                    currentPage: result.pageIndex,
                    pageSize: result.pageSize,
                    pageCount: result.totalPages,
                    total: result.totalCount,
                    items: result.items.map(UserService.toUserModel),
                };
            }).share();
    }
    // Chỉnh sửa thông tin người dùng
    editInforUser(formValue: UserModel): Observable<any> {
        const url = `user/edit`;
        return this.apiService.post(url, formValue)
            .map(response => {
                UserService.toUserModel(response.result);
            })
            .share();
    }
    // Kích hoạt người dùng
    activeUser(id: number): Observable<any> {
        const url = `user/${id}/active`;
        return this.apiService.post(url)
            // .map( response => {
            // })
            .share();
    }
    // Khóa người dùng
    deactiveUser(id: number): Observable<any> {
        const url = `user/${id}/deactive`;
        return this.apiService.post(url)
            .share();
    }
    // Cập nhật ảnh đại diện cho người dùng
    updateAvatarForUser(id: number, ImageFiles: string): Observable<any> {
        const url = `user/${id}/updateavatar?ImageFiles=${ImageFiles}`;
        return this.apiService.post(url)
            .map(response => {
                UserService.toUserModel(response.result);
            })
            .share();
    }
    // Xóa người dùng
    deleteUser(id: number) {
        const url = `user/delete`;
        return this.apiService.post(url, id)
            .share();
    }
}
