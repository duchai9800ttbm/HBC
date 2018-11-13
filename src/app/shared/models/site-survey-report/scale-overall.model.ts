import { Image } from './image';
import { Currency } from '../currency';

export class ScaleOverall {
    tenTaiLieu: string;
    lanPhongVan: number;
    loaiCongTrinh: ConstructionItem[];
    trangthaiCongTrinh: StatusContruction[];
    quyMoDuAn: {
        dienTichCongTruong: number;
        tongDienTichXayDung: number;
        soTang: string;
        tienDo: number;
        donViTienDo: Currency;
    };
    hinhAnhPhoiCanh: Image;
    thongTinVeKetCau: Image;
    nhungYeuCauDacBiet: Image;
}

export class ConstructionItem {
    id: number | string;
    text: string;
    value: string;
    checked: boolean;
}
export class StatusContruction {
    text: string;
    value: string;
    checked: boolean;
}
