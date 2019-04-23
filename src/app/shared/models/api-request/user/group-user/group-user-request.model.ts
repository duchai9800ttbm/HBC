export class GroupUserRequest {
  userGroupName: string;
  userGroupId: number;
  privileges: {
    id: string;
    text: string;
  }[];
  notPrivileges: {
    id: string;
    text: string;
  }[];
  userGroupActiveCheck: boolean;
}
