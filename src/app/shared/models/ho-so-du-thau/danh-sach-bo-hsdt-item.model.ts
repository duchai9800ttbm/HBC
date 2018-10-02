export class DanhSachBoHsdtItem {
    id: number;
    tenderDocumentType: string;
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
}
