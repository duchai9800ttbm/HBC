export class EmailItemModel {
    id: number;
    senderEmployee: {
        id: number;
        employeeId: number;
        employeeNo: string;
        employeeName: string;
        employeeAddress: string;
        employeeDob: number;
        employeeTel: string;
        employeeTel1: string;
        departmentName: string;
        levelName: string;
        employeeAvatar: string;
        departmentRoomName: string;
        branchName: string;
        employeeBirthPlace: string;
        employeeIDNumber: string;
        employeeGender: string;
        employeeTaxNumber: string;
        employeeBankAccount: string
    };
    from: string;
    to: {
        email: string;
        receiveEmployee: {
            employeeName: string;
        }
        isSuccess: boolean;

    } [];
    subject: string;
    sentDate: number;
    content: string;
    isSuccess: boolean;
    isImportant: boolean;
    emailAttatchments: EmailAttachment[];
    checkboxSelected?: boolean;
}

export class EmailAttachment {
    id: number;
    fileName: string;
}


export class EmailFilter {
    category: string;
}

export class EmailCategory {
    category: {
        key: string;
        value: string;
        displayText: string;
    };
    count: number;
}

export class MultipeDelete {
    ids: number[];
}
