export class EmailItemModel {
    id: number;
    senderEmployee: {
        // id: number;
         employeeId: number;
        // employeeNo: string;
         employeeName: string;
        // employeeAddress: string;
        // employeeDob: number;
        // employeeTel: string;
        // employeeTel1: string;
        // departmentName: string;
        // levelName: string;
        // employeeAvatar: string;
        // departmentRoomName: string;
        // branchName: string;
        // employeeBirthPlace: string;
        // employeeIDNumber: string;
        // employeeGender: string;
        // employeeTaxNumber: string;
        // employeeBankAccount: string
    };
    from: string;
    to: string;
    subject: string;
    sentDate: number;
    content: string;
    isSuccess: boolean;
    isImportant: boolean;
    emailAttatchments: EmailAttachment[];
}

class EmailAttachment {
    id: number;
    fileName: string;
}
