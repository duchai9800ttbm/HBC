import { ThongTinDuAn } from './thong-tin-du-an';
import { CacBenLienQuan } from './cac-ben-lien-quan';
import { PhamViCongViec } from './pham-vi-cong-viec';
import { DanhSachNhaThau } from './danh-sach-nha-thau';
import { DienGiaiYeuCauLamRo, DienGiaiDieuKienHopDong, DienGiaiDieuKienHSMT } from './dien-giai-yeu-cau';
import { TableYeuCauDacBiet } from './table-yeu-cau';
import { DanhSachVatTu, HoSoDangLuuY, DienGiaiYeuCauHoSo } from './danh-sach-vat-tu';
import { StakeHolder } from './stack-holder.model';

export class DuLieuLiveFormDKDT {
    id: number;
    bidOpportunityId: number;
    createdEmployeeId: number;
    updatedEmployeeId: number;
    createdEmployee: {
        employeeAvatar: {
            guid: string;
            largeSizeUrl: string;
            thumbSizeUrl: string;
        },
        employeeEmail: string;
        employeeId: number;
        employeeName: string;
        employeeNo: string;
    };
    updatedEmployee: {
        employeeAvatar: {
            guid: string;
            largeSizeUrl: string;
            thumbSizeUrl: string;
        },
        employeeEmail: string;
        employeeId: number;
        employeeName: string;
        employeeNo: string;
    };
    isDraftVersion: boolean;
    documentName: string;
    noiDungCapNhat: string;
    thongTinDuAn: ThongTinDuAn;
    cacBenLienQuan: StakeHolder[];
    phamViCongViec: PhamViCongViec;
    danhSachNhaThau: DanhSachNhaThau[];
    danhSachVatTu: DanhSachVatTu[];
    hoSoDangLuuY: HoSoDangLuuY;
    dienGiaiYeuCauHoSo: DienGiaiYeuCauHoSo;
    dienGiaiYeuCauLamRo: DienGiaiYeuCauLamRo;
    dienGiaiDieuKienHopDong: DienGiaiDieuKienHopDong;
    dienGiaiDieuKienHSMT: DienGiaiDieuKienHSMT;
    yeuCauDacBietKhac: TableYeuCauDacBiet;
    isChangeFormCacBenLienQuan: boolean;
    ngayTao?: number;
}
