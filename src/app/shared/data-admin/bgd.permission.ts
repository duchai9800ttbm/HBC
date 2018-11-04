export const BGDPermissions = [
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
                        key: 74,
                        value: 'DownloadFile',
                        displayText: 'Download file',
                        tenderDocumentTypeId: 0
                    },
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
                        key: 81,
                        value: 'InDNDT',
                        displayText: 'In ĐNDT',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 84,
                        value: 'ChapThuanKhongChapThuan',
                        displayText: 'Chấp thuận/Không chấp thuận ĐNDT (BGĐ)',
                        tenderDocumentTypeId: 0
                    },
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
                        key: 87,
                        value: 'XemEmail',
                        displayText: 'Xem email',
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
                        key: 92,
                        value: 'InBangPCTD',
                        displayText: 'In Bảng PCTĐ',
                        tenderDocumentTypeId: 0
                    },
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
                        key: 113,
                        value: 'InTDG',
                        displayText: 'In TDG',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 115,
                        value: 'TaiTemplateTDG',
                        displayText: 'Tải template TDG',
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
                        key: 125,
                        value: 'XemEmailTBPV',
                        displayText: 'Xem email thông báo PV',
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
                        key: 106,
                        value: 'InLiveForm',
                        displayText: 'In liveform',
                        tenderDocumentTypeId: 3
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
                        key: 106,
                        value: 'InLiveForm',
                        displayText: 'In liveform',
                        tenderDocumentTypeId: 1
                    },
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
                        key: 99,
                        value: 'DownloadFile',
                        displayText: 'Download file',
                        tenderDocumentTypeId: 5
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
                        key: 135,
                        value: 'XemEmailPhanHoi',
                        displayText: 'Xem email phản hồi',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 137,
                        value: 'XemMailThongBaoTrungThau',
                        displayText: 'Xem email thông báo trúng thầu',
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
                        key: 141,
                        value: 'TaiXuongHD',
                        displayText: 'Tải xuống HĐ',
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
                        key: 144,
                        value: 'XemDanhSachEmailDaGui',
                        displayText: 'Xem danh sách email đã gửi',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 146,
                        value: 'TaiXuongBBCuocHop',
                        displayText: 'Tải xuống BB cuộc họp',
                        tenderDocumentTypeId: 0
                    },
                    {
                        key: 149,
                        value: 'TaiXuongFilePresentation',
                        displayText: 'Tải xuống file Presentation',
                        tenderDocumentTypeId: 0
                    }
                ]
            }
        ]
    }
];
