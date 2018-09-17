import { Image } from './image';

export class ScaleOverall {
    tenTaiLieu: string;
    lanPhongVan: number;
    loaiCongTrinh: ConstructionItem[];
    trangthaiCongTrinh: ConstructionItem[];
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


export class ConstructionItem {
    value: string;
    text: string;
    checked: boolean;
}
