import { Image } from './image';

export class ScaleOverall {
    documentName: string;
    interviewTimes: number;
    vanPhong: boolean;
    khuDanCu: boolean;
    trungTamThuongMai: boolean;
    khachSan: boolean;
    nhaCongNghiep: boolean;
    toHop: boolean;
    canHo: boolean;
    haTang: boolean;
    mep: boolean;
    sanBay: boolean;
    nhaphoBietThu: boolean;
    truongHoc: boolean;
    congtrinhMoi: boolean;
    nangCapCaiTien: boolean;
    thayDoiBoSung: boolean;
    thaoDoCaiTien: boolean;
    khac: string;
    scale: {
        areaSite: number;
        totalArea: number;
        numberOfFloor: string;
        progress: number;
    };
    hinhAnhPhoiCanh: Image;
    thongTinVeKetCau: Image;
    nhungYeuCauDacBiet: Image;
}
