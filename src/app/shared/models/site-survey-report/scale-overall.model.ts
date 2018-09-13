import { Image } from './image';

export class ScaleOverall {
    tenTaiLieu: string;
    lanPhongVan: number;
    loaiCongTrinh: {
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
    };
    quyMoDuAn: {
        dienTichCongTruong: number;
        tongDienTichXayDung: number;
        soTang: string;
        tienDo: number;
    };
    hinhAnhPhoiCanh: Image;
    thongTinVeKetCau: Image;
    nhungYeuCauDacBiet: Image;
}
