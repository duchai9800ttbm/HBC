export class DanhSachBoHsdtItem {
    id: number;
    tenderDocumentType: {
        id: number;
        name: string;
        count: number;
    };
    documentName: string;
    version: number;
    status: string;
    uploadedBy: {
        employeeId: number;
        employeeNo: string;
        employeeName: string;
        employeeAvatar: string;
        employeeEmail: string
    };
    uploadedDate: number;
    fileGuid: string;
    interViewTimes: number;
    desc: string;
}
