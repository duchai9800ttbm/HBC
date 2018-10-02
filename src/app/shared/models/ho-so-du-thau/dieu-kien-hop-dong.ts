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
