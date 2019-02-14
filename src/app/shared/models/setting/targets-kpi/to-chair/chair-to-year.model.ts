export class ChairToYear {
    year: 0;
    kpiGroupChairs:
        {
            kpiGroup: {
                id: 0;
                name: string;
                desc: string;
                status: {
                    key: string;
                    value: string;
                    displayText: string
                }
            };
            chairDetail: {
                employee: {
                    id: 0;
                    employeeId: 0;
                    employeeNo: string;
                    employeeName: string;
                    employeeAddress: string;
                    employeeDob: 0;
                    employeeTel: string;
                    employeeTel1: string;
                    departmentName: string;
                    levelName: string;
                    employeeAvatar: {
                        guid: string;
                        thumbSizeUrl: string;
                        largeSizeUrl: string
                    };
                    departmentRoomName: string;
                    branchName: string;
                    employeeBirthPlace: string;
                    employeeIDNumber: string;
                    employeeGender: string;
                    employeeTaxNumber: string;
                    employeeBankAccount: string
                };
                kpiTarget: 0
            }[];
        }[];
}
