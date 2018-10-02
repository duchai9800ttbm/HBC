import { ThongTinDoiTac } from './thong-tin-doi-tac';
import { DieuKienHopDong } from './dieu-kien-hop-dong';
import { DieuKienHoSo } from './dieu-kien-ho-so';

export class DienGiaiYeuCauLamRo {
    nhaTuVan: ThongTinDoiTac;
    nhaSuDung: ThongTinDoiTac;
    ngayHetHan: number;
    ghiChuThem: string;
}

export class DienGiaiDieuKienHopDong {
    loaiHopDong: {
        name: string,
        desc: string;
    }[];
    dieuKienTheoHSMT: DieuKienHopDong;
    dieuKienTheoHBC: DieuKienHopDong;
}

export class DienGiaiDieuKienHSMT {
    theoHSMT: DieuKienHoSo;
    theoHBC: DieuKienHoSo;
}
