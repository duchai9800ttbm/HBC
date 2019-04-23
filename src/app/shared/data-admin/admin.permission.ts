export const AdminPermissions = [
    {
        bidOpportunityStage: 'HSMT',
        userPermissionDetails: [
            {
                permissionGroup: {
                    key: 1,
                    value: 'HSMT',
                    displayText: 'Hồ sơ mời thầu'
                },
                permissions: [
                    {
                        key: 73,
                        value: 'UploadHSMT',
                        displayText: 'Upload HSMT',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 74,
                        value: 'DownloadFile',
                        displayText: 'Download file',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 75,
                        value: 'XoaFile',
                        displayText: 'Xóa file',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 76,
                        value: 'XacNhanDaDuHSMT',
                        displayText: 'Xác nhận Đã đủ HSMT',
                        tenderDocumentTypeId: 0
                    }
                ]
            }
        ]
    },
    {
        bidOpportunityStage: 'HSDT',
        userPermissionDetails: [
            {
                permissionGroup: {
                    key: 2,
                    value: 'PhieuDeNghiDuThau',
                    displayText: 'Phiếu đề nghị dự thầu'
                },
                permissions: [
                    {
                        key: 77,
                        value: 'TaoMoiDNDT',
                        displayText: 'Tạo mới ĐNDT',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 78,
                        value: 'XemDNDT',
                        displayText: 'Xem ĐNDT',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 79,
                        value: 'SuaDNDT',
                        displayText: 'Sửa ĐNDT',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 80,
                        value: 'XoaDNDT',
                        displayText: 'Xóa ĐNDT',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 81,
                        value: 'InDNDT',
                        displayText: 'In ĐNDT',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 82,
                        value: 'XacNhanKy',
                        displayText: 'Xác nhân ký (Giám đốc DT)',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 83,
                        value: 'GuiDuyetDNDT',
                        displayText: 'Gửi duyệt ĐNDT',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 84,
                        value: 'ChapThuanKhongChapThuan',
                        displayText: 'Chấp thuận/Không chấp thuận ĐNDT (BGĐ)',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 85,
                        value: 'TaiTemplate',
                        displayText: 'Tải template ĐNDT',
                        tenderDocumentTypeId: 0
                    }
                ]
            },
            {
                permissionGroup: {
                    key: 3,
                    value: 'TrienKhaiVaPhanCongTienDo',
                    displayText: 'Triển khai & phân công tiến độ (PCTĐ)'
                },
                permissions: [
                    {
                        key: 86,
                        value: 'ThongBaoTrienKhai',
                        displayText: 'Thông báo triển khai',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 87,
                        value: 'XemEmail',
                        displayText: 'Xem email',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 88,
                        value: 'TaoMoiBangPCTD',
                        displayText: 'Tạo mói bảng PCTĐ',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 89,
                        value: 'XemBangPCTD',
                        displayText: 'Xem Bảng PCTĐ',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 90,
                        value: 'SuaBangPCTD',
                        displayText: 'Sửa Bảng PCTĐ',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 91,
                        value: 'XoaBangPCTD',
                        displayText: 'Xoá Bảng PCTĐ',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 92,
                        value: 'InBangPCTD',
                        displayText: 'In Bảng PCTĐ',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 93,
                        value: 'XacNhanKyPrepared',
                        displayText: 'Xác nhận ký (Prepared by)',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 94,
                        value: 'XacNhanKyApproved',
                        displayText: 'Xác nhận ký (Approved by)',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 95,
                        value: 'GuiPCTD',
                        displayText: 'Gửi PCTĐ',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 96,
                        value: 'TaiTemplatePCTD',
                        displayText: 'Tải template PCTĐ',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 97,
                        value: 'BatDauLapHSDT',
                        displayText: 'Bắt đầu lập HSTD',
                        tenderDocumentTypeId: 0
                    }
                ]
            },
            {
                permissionGroup: {
                    key: '5',
                    value: 'TrinhDuyetGia',
                    displayText: 'Trình duyệt giá (TDG)\r\n'
                },
                permissions: [
                    {
                        key: 109,
                        value: 'TaoMoiTDG',
                        displayText: 'Tạo mới TDG',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 110,
                        value: 'XemTDG',
                        displayText: 'Xem TDG',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 111,
                        value: 'SuaTDG',
                        displayText: 'Sửa TDG',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 112,
                        value: 'XoaTDG',
                        displayText: 'Xoá TDG',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 113,
                        value: 'InTDG',
                        displayText: 'In TDG',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 114,
                        value: 'DuyetTDGTNDuThau',
                        displayText: 'Duyệt TDG (TN Dự thầu)',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 115,
                        value: 'TaiTemplateTDG',
                        displayText: 'Tải template TDG',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 116,
                        value: 'DuyetTDGTPDuThau',
                        displayText: 'Duyệt TDG (TP. Dự thầu)',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 117,
                        value: 'GuiDuyet',
                        displayText: 'Gửi duyệt/Gửi duyệt lại TDG',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 118,
                        value: 'DuyetTDGBGD',
                        displayText: 'Duyệt TDG (BGĐ)',
                        tenderDocumentTypeId: 0
                    }
                ]
            },
            {
                permissionGroup: {
                    key: '6',
                    value: 'ChotVaNopHSDT',
                    displayText: 'Chốt & nộp HSDT\r\n'
                },
                permissions: [
                    {
                        key: 119,
                        value: 'ChotHoSo',
                        displayText: 'Chốt hồ sơ',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 120,
                        value: 'NopHSDT',
                        displayText: 'Nộp HSDT',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 121,
                        value: 'HieuChinhHSDT',
                        displayText: 'Hiệu chỉnh HSDT',
                        tenderDocumentTypeId: 0
                    }
                ]
            },
            {
                permissionGroup: {
                    key: '8',
                    value: 'QuanLyPhongVanThuongThao',
                    displayText: 'Quản lý phỏng vấn/thương thảo\r\n'
                },
                permissions: [
                    {
                        key: 122,
                        value: 'TaoMoiLMPV',
                        displayText: 'Tạo mới lời mời phỏng vấn',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 123,
                        value: 'CapNhatLMPV',
                        displayText: 'Cập nhật lời mời phỏng vấn',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 124,
                        value: 'ThongBaoPV',
                        displayText: 'Thông báo phỏng vấn',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 125,
                        value: 'XemEmailTBPV',
                        displayText: 'Xem email thông báo PV',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 126,
                        value: 'ChotCongTacChuanBiPhongVan',
                        displayText: 'Chốt công tác chuẩn bị PV',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 127,
                        value: 'UploadBBPV',
                        displayText: 'Upload BBPV',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 128,
                        value: 'DongPV',
                        displayText: 'Đóng phỏng vấn',
                        tenderDocumentTypeId: 0
                    }
                ]
            },
            {
                permissionGroup: {
                    key: '11',
                    value: 'LapHoSoDuThauLiveForm',
                    displayText: 'Lập HSDT (Liveform)\r\n'
                },
                permissions: [
                    {
                        key: 102,
                        value: 'TaoMoiLiveForm',
                        displayText: 'Tạo mới liveform',
                        tenderDocumentTypeId: 3
                    },
                    {
                        key: 103,
                        value: 'XemLiveForm',
                        displayText: 'Xem liveform',
                        tenderDocumentTypeId: 3
                    },
                    {
                        key: 104,
                        value: 'SuaLiveForm',
                        displayText: 'Sửa liveform',
                        tenderDocumentTypeId: 3
                    },
                    {
                        key: 105,
                        value: 'XoaLiveForm',
                        displayText: 'Xoá liveform',
                        tenderDocumentTypeId: 3
                    },
                    {
                        key: 106,
                        value: 'InLiveForm',
                        displayText: 'In liveform',
                        tenderDocumentTypeId: 3
                    },
                    {
                        key: 107,
                        value: 'TaiTemplate',
                        displayText: 'Tải template',
                        tenderDocumentTypeId: 3
                    },
                    {
                        key: 102,
                        value: 'TaoMoiLiveForm',
                        displayText: 'Tạo mới liveform',
                        tenderDocumentTypeId: 1
                    },
                    {
                        key: 103,
                        value: 'XemLiveForm',
                        displayText: 'Xem liveform',
                        tenderDocumentTypeId: 1
                    },
                    {
                        key: 104,
                        value: 'SuaLiveForm',
                        displayText: 'Sửa liveform',
                        tenderDocumentTypeId: 1
                    },
                    {
                        key: 105,
                        value: 'XoaLiveForm',
                        displayText: 'Xoá liveform',
                        tenderDocumentTypeId: 1
                    },
                    {
                        key: 106,
                        value: 'InLiveForm',
                        displayText: 'In liveform',
                        tenderDocumentTypeId: 1
                    },
                    {
                        key: 107,
                        value: 'TaiTemplate',
                        displayText: 'Tải template',
                        tenderDocumentTypeId: 1
                    },
                    {
                        key: 108,
                        value: 'ChotHSDT',
                        displayText: 'Chốt HSDT',
                        tenderDocumentTypeId: 3
                    },
                    {
                        key: 108,
                        value: 'ChotHSDT',
                        displayText: 'Chốt HSDT',
                        tenderDocumentTypeId: 1
                    }
                ]
            },
            {
                permissionGroup: {
                    key: 4,
                    value: 'LapHoSoDuThauFile',
                    displayText: 'Lập HSDT (upload file)\r\n'
                },
                permissions: [
                    {
                        key: 98,
                        value: 'UploadHSDT',
                        displayText: 'Upload HSDT',
                        tenderDocumentTypeId: 6
                    },
                    {
                        key: 101,
                        value: 'TaiTemplate',
                        displayText: 'Tải template',
                        tenderDocumentTypeId: 6
                    },
                    {
                        key: 101,
                        value: 'TaiTemplate',
                        displayText: 'Tải template',
                        tenderDocumentTypeId: 5
                    },
                    {
                        key: 101,
                        value: 'TaiTemplate',
                        displayText: 'Tải template',
                        tenderDocumentTypeId: 2
                    },
                    {
                        key: 98,
                        value: 'UploadHSDT',
                        displayText: 'Upload HSDT',
                        tenderDocumentTypeId: 5
                    },
                    {
                        key: 99,
                        value: 'DownloadFile',
                        displayText: 'Download file',
                        tenderDocumentTypeId: 5
                    },
                    {
                        key: 100,
                        value: 'XoaFile',
                        displayText: 'Xoá file',
                        tenderDocumentTypeId: 5
                    },
                    {
                        key: 98,
                        value: 'UploadHSDT',
                        displayText: 'Upload HSDT',
                        tenderDocumentTypeId: 2
                    },
                    {
                        key: 98,
                        value: 'UploadHSDT',
                        displayText: 'Upload HSDT',
                        tenderDocumentTypeId: 4
                    },
                    {
                        key: 98,
                        value: 'UploadHSDT',
                        displayText: 'Upload HSDT',
                        tenderDocumentTypeId: 7
                    },
                    {
                        key: 98,
                        value: 'UploadHSDT',
                        displayText: 'Upload HSDT',
                        tenderDocumentTypeId: 8
                    },
                    {
                        key: 98,
                        value: 'UploadHSDT',
                        displayText: 'Upload HSDT',
                        tenderDocumentTypeId: 21
                    },
                    {
                        key: 99,
                        value: 'DownloadFile',
                        displayText: 'Download file',
                        tenderDocumentTypeId: 2
                    },
                    {
                        key: 99,
                        value: 'DownloadFile',
                        displayText: 'Download file',
                        tenderDocumentTypeId: 4
                    },
                    {
                        key: 99,
                        value: 'DownloadFile',
                        displayText: 'Download file',
                        tenderDocumentTypeId: 6
                    },
                    {
                        key: 99,
                        value: 'DownloadFile',
                        displayText: 'Download file',
                        tenderDocumentTypeId: 7
                    },
                    {
                        key: 99,
                        value: 'DownloadFile',
                        displayText: 'Download file',
                        tenderDocumentTypeId: 8
                    },
                    {
                        key: 99,
                        value: 'DownloadFile',
                        displayText: 'Download file',
                        tenderDocumentTypeId: 21
                    },
                    {
                        key: 100,
                        value: 'XoaFile',
                        displayText: 'Xoá file',
                        tenderDocumentTypeId: 2
                    },
                    {
                        key: 100,
                        value: 'XoaFile',
                        displayText: 'Xoá file',
                        tenderDocumentTypeId: 4
                    },
                    {
                        key: 100,
                        value: 'XoaFile',
                        displayText: 'Xoá file',
                        tenderDocumentTypeId: 6
                    },
                    {
                        key: 100,
                        value: 'XoaFile',
                        displayText: 'Xoá file',
                        tenderDocumentTypeId: 7
                    },
                    {
                        key: 100,
                        value: 'XoaFile',
                        displayText: 'Xoá file',
                        tenderDocumentTypeId: 8
                    },
                    {
                        key: 100,
                        value: 'XoaFile',
                        displayText: 'Xoá file',
                        tenderDocumentTypeId: 21
                    },
                    {
                        key: 101,
                        value: 'TaiTemplate',
                        displayText: 'Tải template',
                        tenderDocumentTypeId: 4
                    },
                    {
                        key: 101,
                        value: 'TaiTemplate',
                        displayText: 'Tải template',
                        tenderDocumentTypeId: 7
                    },
                    {
                        key: 101,
                        value: 'TaiTemplate',
                        displayText: 'Tải template',
                        tenderDocumentTypeId: 8
                    },
                    {
                        key: 101,
                        value: 'TaiTemplate',
                        displayText: 'Tải template',
                        tenderDocumentTypeId: 21
                    }
                ]
            }
        ]
    },
    {
        bidOpportunityStage: 'KQDT',
        userPermissionDetails: [
            {
                permissionGroup: {
                    key: 9,
                    value: 'KetQuaDuThau',
                    displayText: 'Kết quả dự thầu'
                },
                permissions: [
                    {
                        key: 129,
                        value: 'ChonKQDT',
                        displayText: 'Chọn KQDT (Trúng/Trật/Huỷ)',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 130,
                        value: 'UploadKQDT',
                        displayText: 'Upload KQDT (Trúng/Trật)',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 131,
                        value: 'TaiXuongKQDT',
                        displayText: ' Tải xuống KQDT',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 132,
                        value: 'TaiTemplate',
                        displayText: 'Tải template',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 133,
                        value: 'XoaKQDT',
                        displayText: 'Xoá KQDT',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 134,
                        value: 'ThongBaoDenPhongHopDong',
                        displayText: 'Thông báo đến P.Hợp đồng',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 135,
                        value: 'XemEmailPhanHoi',
                        displayText: 'Xem email phản hồi',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 136,
                        value: 'ThongBaoStakeholders',
                        displayText: 'Thông báo đến Stakeholders',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 137,
                        value: 'XemMailThongBaoTrungThau',
                        displayText: 'Xem email thông báo trúng thầu',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 138,
                        value: 'ChuyenGiaoTaiLieu',
                        displayText: 'Chuyển giao tài liệu',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 139,
                        value: 'XemMailChuyenGiao',
                        displayText: 'Xem email chuyển giao',
                        tenderDocumentTypeId: 0
                    }
                ]
            },
            {
                permissionGroup: {
                    key: 10,
                    value: 'HopDongKiKet',
                    displayText: 'Hợp đồng kí kết'
                },
                permissions: [
                    {
                        key: 140,
                        value: 'ThemMoiHD',
                        displayText: 'Thêm mới HĐ',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 141,
                        value: 'TaiXuongHD',
                        displayText: 'Tải xuống HĐ',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 142,
                        value: 'XoaHD',
                        displayText: 'Xoá HĐ',
                        tenderDocumentTypeId: 0
                    }
                ]
            },
            {
                permissionGroup: {
                    key: 12,
                    value: 'HopKickOff',
                    displayText: 'Họp kick-off\r\n'
                },
                permissions: [
                    {
                        key: 143,
                        value: 'ThongBaoHopKickoff',
                        displayText: 'Thông báo họp kick-off',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 144,
                        value: 'XemDanhSachEmailDaGui',
                        displayText: 'Xem danh sách email đã gửi',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 145,
                        value: 'UploadBBCuocHop',
                        displayText: 'Upload BB cuộc họp',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 146,
                        value: 'TaiXuongBBCuocHop',
                        displayText: 'Tải xuống BB cuộc họp',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 147,
                        value: 'XoaBBCuocHop',
                        displayText: 'Xoá BB cuộc họp',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 148,
                        value: 'UploadFilePresentation',
                        displayText: 'Upload file Presentation',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 149,
                        value: 'TaiXuongFilePresentation',
                        displayText: 'Tải xuống file Presentation',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 150,
                        value: 'XoaFilePresentation',
                        displayText: 'Xoá file Presentation',
                        tenderDocumentTypeId: 0
                    }
                ]
            }
        ]
    }
];
