export const AdminPermissions = [
    {
        bidOpportunityStage: 'HSMT',
        userPermissionDetails: [
            {
                permissionGroup: {
                    key: '1',
                    value: 'HSMT',
                    displayText: 'Hồ sơ mời thầu'
                },
                permissions: [
                    {
                        key: '73',
                        value: 'UploadHSMT',
                        displayText: 'Upload HSMT'
                    },
                    {
                        key: '74',
                        value: 'DownloadFile',
                        displayText: 'Download file'
                    },
                    {
                        key: '75',
                        value: 'XoaFile',
                        displayText: 'Xóa file'
                    },
                    {
                        key: '76',
                        value: 'XacNhanDaDuHSMT',
                        displayText: 'Xác nhận Đã đủ HSMT'
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
                    key: '2',
                    value: 'PhieuDeNghiDuThau',
                    displayText: 'Phiếu đề nghị dự thầu'
                },
                permissions: [
                    {
                        key: '77',
                        value: 'TaoMoiDNDT',
                        displayText: 'Tạo mới ĐNDT'
                    },
                    {
                        key: '78',
                        value: 'XemDNDT',
                        displayText: 'Xem ĐNDT'
                    },
                    {
                        key: '79',
                        value: 'SuaDNDT',
                        displayText: 'Sửa ĐNDT'
                    },
                    {
                        key: '80',
                        value: 'XoaDNDT',
                        displayText: 'Xóa ĐNDT'
                    },
                    {
                        key: '81',
                        value: 'InDNDT',
                        displayText: 'In ĐNDT'
                    },
                    {
                        key: '82',
                        value: 'XacNhanKy',
                        displayText: 'Xác nhân ký (Giám đốc DT)'
                    },
                    {
                        key: '83',
                        value: 'GuiDuyetDNDT',
                        displayText: 'Gửi duyệt ĐNDT'
                    },
                    {
                        key: '84',
                        value: 'ChapThuanKhongChapThuan',
                        displayText: 'Chấp thuận/Không chấp thuận ĐNDT (BGĐ)'
                    },
                    {
                        key: '85',
                        value: 'TaiTemplate',
                        displayText: 'Tải template ĐNDT'
                    }
                ]
            },
            {
                permissionGroup: {
                    key: '3',
                    value: 'TrienKhaiVaPhanCongTienDo',
                    displayText: 'Triển khai & phân công tiến độ (PCTĐ)'
                },
                permissions: [
                    {
                        key: '86',
                        value: 'ThongBaoTrienKhai',
                        displayText: 'Thông báo triển khai'
                    },
                    {
                        key: '87',
                        value: 'XemEmail',
                        displayText: 'Xem email'
                    },
                    {
                        key: '88',
                        value: 'TaoMoiBangPCTD',
                        displayText: 'Tạo mói bảng PCTĐ'
                    },
                    {
                        key: '89',
                        value: 'XemBangPCTD',
                        displayText: 'Xem Bảng PCTĐ'
                    },
                    {
                        key: '90',
                        value: 'SuaBangPCTD',
                        displayText: 'Sửa Bảng PCTĐ'
                    },
                    {
                        key: '91',
                        value: 'XoaBangPCTD',
                        displayText: 'Xoá Bảng PCTĐ'
                    },
                    {
                        key: '92',
                        value: 'InBangPCTD',
                        displayText: 'In Bảng PCTĐ'
                    },
                    {
                        key: '93',
                        value: 'XacNhanKyPrepared',
                        displayText: 'Xác nhận ký (Prepared by)'
                    },
                    {
                        key: '94',
                        value: 'XacNhanKyApproved',
                        displayText: 'Xác nhận ký (Approved by)'
                    },
                    {
                        key: '95',
                        value: 'GuiPCTD',
                        displayText: 'Gửi PCTĐ'
                    },
                    {
                        key: '96',
                        value: 'TaiTemplatePCTD',
                        displayText: 'Tải template PCTĐ'
                    },
                    {
                        key: '97',
                        value: 'BatDauLapHSDT',
                        displayText: 'Bắt đầu lập HSTD'
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
                        key: '109',
                        value: 'TaoMoiTDG',
                        displayText: 'Tạo mới TDG'
                    },
                    {
                        key: '110',
                        value: 'XemTDG',
                        displayText: 'Xem TDG'
                    },
                    {
                        key: '111',
                        value: 'SuaTDG',
                        displayText: 'Sửa TDG'
                    },
                    {
                        key: '112',
                        value: 'XoaTDG',
                        displayText: 'Xoá TDG'
                    },
                    {
                        key: '113',
                        value: 'InTDG',
                        displayText: 'In TDG'
                    },
                    {
                        key: '114',
                        value: 'DuyetTDGTNDuThau',
                        displayText: 'Duyệt TDG (TN Dự thầu)'
                    },
                    {
                        key: '115',
                        value: 'TaiTemplateTDG',
                        displayText: 'Tải template TDG'
                    },
                    {
                        key: '116',
                        value: 'DuyetTDGTPDuThau',
                        displayText: 'Duyệt TDG (TP. Dự thầu)'
                    },
                    {
                        key: '117',
                        value: 'GuiDuyet',
                        displayText: 'Gửi duyệt/Gửi duyệt lại TDG'
                    },
                    {
                        key: '118',
                        value: 'DuyetTDGBGD',
                        displayText: 'Duyệt TDG (BGĐ)'
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
                        key: '119',
                        value: 'ChotHoSo',
                        displayText: 'Chốt hồ sơ'
                    },
                    {
                        key: '120',
                        value: 'NopHSDT',
                        displayText: 'Nộp HSDT'
                    },
                    {
                        key: '121',
                        value: 'HieuChinhHSDT',
                        displayText: 'Hiệu chỉnh HSDT'
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
                        key: '122',
                        value: 'TaoMoiLMPV',
                        displayText: 'Tạo mới lời mời phỏng vấn'
                    },
                    {
                        key: '123',
                        value: 'CapNhatLMPV',
                        displayText: 'Cập nhật lời mời phỏng vấn'
                    },
                    {
                        key: '124',
                        value: 'ThongBaoPV',
                        displayText: 'Thông báo phỏng vấn'
                    },
                    {
                        key: '125',
                        value: 'XemEmailTBPV',
                        displayText: 'Xem email thông báo PV'
                    },
                    {
                        key: '126',
                        value: 'ChotCongTacChuanBiPhongVan',
                        displayText: 'Chốt công tác chuẩn bị PV'
                    },
                    {
                        key: '127',
                        value: 'UploadBBPV',
                        displayText: 'Upload BBPV'
                    },
                    {
                        key: '128',
                        value: 'DongPV',
                        displayText: 'Đóng phỏng vấn'
                    }
                ]
            },
            {
                permissionGroup: {
                    key: '4',
                    value: 'LapHoSoDuThauFile',
                    displayText: 'Lập HSDT (upload file)\r\n'
                },
                permissions: [
                    {
                        key: '98',
                        value: 'UploadHSDT',
                        displayText: 'Upload HSDT'
                    },
                    {
                        key: '99',
                        value: 'DownloadFile',
                        displayText: 'Download file'
                    },
                    {
                        key: '100',
                        value: 'XoaFile',
                        displayText: 'Xoá file'
                    },
                    {
                        key: '101',
                        value: 'TaiTemplate',
                        displayText: 'Tải template'
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
                        key: '102',
                        value: 'TaoMoiLiveForm',
                        displayText: 'Tạo mới liveform'
                    },
                    {
                        key: '103',
                        value: 'XemLiveForm',
                        displayText: 'Xem liveform'
                    },
                    {
                        key: '104',
                        value: 'SuaLiveForm',
                        displayText: 'Sửa liveform'
                    },
                    {
                        key: '105',
                        value: 'XoaLiveForm',
                        displayText: 'Xoá liveform'
                    },
                    {
                        key: '106',
                        value: 'InLiveForm',
                        displayText: 'In liveform'
                    },
                    {
                        key: '107',
                        value: 'TaiTemplate',
                        displayText: 'Tải template'
                    },
                    {
                        key: '108',
                        value: 'ChotHSDT',
                        displayText: 'Chốt HSDT'
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
                    key: '9',
                    value: 'KetQuaDuThau',
                    displayText: 'Kết quả dự thầu'
                },
                permissions: [
                    {
                        key: '129',
                        value: 'ChonKQDT',
                        displayText: 'Chọn KQDT (Trúng/Trật/Huỷ)'
                    },
                    {
                        key: '130',
                        value: 'UploadKQDT',
                        displayText: 'Upload KQDT (Trúng/Trật)'
                    },
                    {
                        key: '131',
                        value: 'TaiXuongKQDT',
                        displayText: ' Tải xuống KQDT'
                    },
                    {
                        key: '132',
                        value: 'TaiTemplate',
                        displayText: 'Tải template'
                    },
                    {
                        key: '133',
                        value: 'XoaKQDT',
                        displayText: 'Xoá KQDT'
                    },
                    {
                        key: '134',
                        value: 'ThongBaoDenPhongHopDong',
                        displayText: 'Thông báo đến P.Hợp đồng'
                    },
                    {
                        key: '135',
                        value: 'XemEmailPhanHoi',
                        displayText: 'Xem email phản hồi'
                    },
                    {
                        key: '136',
                        value: 'ThongBaoStakeholders',
                        displayText: 'Thông báo đến Stakeholders'
                    },
                    {
                        key: '137',
                        value: 'XemMailThongBaoTrungThau',
                        displayText: 'Xem email thông báo trúng thầu'
                    },
                    {
                        key: '138',
                        value: 'ChuyenGiaoTaiLieu',
                        displayText: 'Chuyển giao tài liệu'
                    },
                    {
                        key: '139',
                        value: 'XemMailChuyenGiao',
                        displayText: 'Xem email chuyển giao'
                    }
                ]
            },
            {
                permissionGroup: {
                    key: '10',
                    value: 'HopDongKiKet',
                    displayText: 'Hợp đồng kí kết'
                },
                permissions: [
                    {
                        key: '140',
                        value: 'ThemMoiHD',
                        displayText: 'Thêm mới HĐ'
                    },
                    {
                        key: '141',
                        value: 'TaiXuongHD',
                        displayText: 'Tải xuống HĐ'
                    },
                    {
                        key: '142',
                        value: 'XoaHD',
                        displayText: 'Xoá HĐ'
                    }
                ]
            },
            {
                permissionGroup: {
                    key: '12',
                    value: 'HopKickOff',
                    displayText: 'Họp kick-off\r\n'
                },
                permissions: [
                    {
                        key: '143',
                        value: 'ThongBaoHopKickoff',
                        displayText: 'Thông báo họp kick-off'
                    },
                    {
                        key: '144',
                        value: 'XemDanhSachEmailDaGui',
                        displayText: 'Xem danh sách email đã gửi'
                    },
                    {
                        key: '145',
                        value: 'UploadBBCuocHop',
                        displayText: 'Upload BB cuộc họp'
                    },
                    {
                        key: '146',
                        value: 'TaiXuongBBCuocHop',
                        displayText: 'Tải xuống BB cuộc họp'
                    },
                    {
                        key: '147',
                        value: 'XoaBBCuocHop',
                        displayText: 'Xoá BB cuộc họp'
                    },
                    {
                        key: '148',
                        value: 'UploadFilePresentation',
                        displayText: 'Upload file Presentation'
                    },
                    {
                        key: '149',
                        value: 'TaiXuongFilePresentation',
                        displayText: 'Tải xuống file Presentation'
                    },
                    {
                        key: '150',
                        value: 'XoaFilePresentation',
                        displayText: 'Xoá file Presentation'
                    }
                ]
            }
        ]
    }
];
