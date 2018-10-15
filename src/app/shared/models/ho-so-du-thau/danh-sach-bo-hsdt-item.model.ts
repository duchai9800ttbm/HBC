export class DanhSachBoHsdtItem {
    id: number;
    tenderDocumentTypeId: number;
    tenderDocumentType: {
        id: number;
        parentId: number;
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
