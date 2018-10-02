import { ImageItem } from '../site-survey-report/image';

export class DuLieuLiveFormDKDT {
    thongTinDuAn: ThongTinDuAn;
    cacBenLienQuan: CacBenLienQuan;
    phamViCongViec: PhamViCongViec;
    danhSachNhaThau: DanhSachNhaThau[];
    danhSachVatTu: DanhSachVatTu[];
    hoSoDangLuuY: HoSoDangLuuY;
    dienGiaiYeuCauHoSo: DienGiaiYeuCauHoSo;
    dienGiaiYeuCauLamRo: DienGiaiYeuCauLamRo;
    dienGiaiDieuKienHopDong: DienGiaiDieuKienHopDong;
    dienGiaiDieuKienHSMT: DIenGiaiDieuKienHSMT;
    yeuCauDacBietKhac: TableYeuCauDacBiet[];
    noiDungCapNhat: string;
}

export class ThongTinDuAn {
    tenTaiLieu: string;
    lanPhongVan: number;
    hinhAnhPhoiCanh: ImageItem[];
    banVeMasterPlan: ImageItem[];
    dienGiaiThongTinDuAn: string;
}
export class CacBenLienQuan {
    chuDauTu: ThongTinCacBen;
    quanLyDuAn: ThongTinCacBen;
    quanLyChiPhi: ThongTinCacBen;
    thietKeKienTruc: ThongTinCacBen;
    thietKeKetCau: ThongTinCacBen;
    thietKeCoDien: ThongTinCacBen[];
    thongTinKhac: ThongTinCacBen;
}
export class PhamViCongViec {
    phamViBaoGom: PhamViCongViecItem[];
    phamViKhongBaoGom: PhamViCongViecItem[];
}
export class DanhSachNhaThau {
    tenGoiCongViec: string;
    ghiChuThem: string;
    thanhTien?: number;
}
export class DanhSachVatTu {
    tenVatTu: string;
    ghiChuThem: string;
}
export class HoSoDangLuuY {
    taiLieuLuuY: string[];
    soLuong: number;
    ngonNgu: string[];
}
export class DienGiaiYeuCauHoSo {
    noiNop: string;
    nguoiNhan: string;
    hanNop: number;
}
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
export class DIenGiaiDieuKienHSMT {
    theoHSMT: DieuKienHoSo;
    theoHBC: DieuKienHoSo;
}

export class ThongTinCacBen {
    donVi: string;
    lienHe: string[];
    ghiChu: string;
}
export class PhamViCongViecItem {
    congTac: string;
    dienGiaiCongTac: string;
}
export class ThongTinDoiTac {
    tenCongTy: string;
    diaChiCongTy: string;
    nguoiLienHe: {
        hoVaTen: string;
        diaChi: string;
        email: string;
        viTri: string;
    };
}

export class DieuKienHopDong {
    baoLanhThucHien: {
        phanTram: number;
        hieuLuc: string;
    };
    baoLanhTamUng: {
        phanTram: number;
        hieuLuc: string;
    };
    thanhToan: {
        loaiThanhToan: string;
        thoiGianThanhToan: number;
        thanhToanKhiTapKet: string;
    };
    tienGiuLai: {
        phanTram: number;
        gioiHanTienGiuLai: number;
        thanhToanTienGui: string;
    };
    phatTreTienDo: {
        phanTram: number;
        gioiHanPhatTienDo: number;
    };
    thoiGianBaoHanh: number;
    baoHiem: {
        baoHiemMayMoc: string[];
        baoHiemConNguoi: string;
        baoHiemCongTrinh: string;
    };
}

export class DieuKienHoSo {
    baoLanhDuThau: {
        giaTri: number;
        hieuLuc: string;
    };
    hieuLucHoSo: string;
    tienDo?: {
        ngayKhoiCong: number;
        thoiGianHoanThanh: number;
    };
    cacLoaiThue?: string[];
    donViTienTe?: string[];
}

export class TableYeuCauDacBiet {
    tenGoiThau: {
        tenWebsite: string;
        linkWebsite: string;
    };
    danhGiaDauThau: string[];
    thongTinKhac: {
        phanTram: number;
        ghiChu: string;
    };
}
