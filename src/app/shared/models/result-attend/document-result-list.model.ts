export class DocumentResultList {
    id: number;
    name: string;
    version: number;
    desc: string;
    uploadBy: {
        employeeId: number;
        employeeNo: string;
        employeeName: string;
        employeeAvatar: {
            guid: string;
            thumbSizeUrl: string;
            largeSizeUrl: string;
        },
        employeeEmail: string;
    };
    uploadDate: number;
    interviewTimes: number;
    fileGuid: string;
    linkUrl: string;
}
