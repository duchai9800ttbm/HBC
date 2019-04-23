import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { TenderPriceApproval, TenderPriceApprovalShort } from '../../../../../../shared/models/price-review/price-review.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import DateTimeConvertHelper from '../../../../../../shared/helpers/datetime-convert-helper';
import { PriceReviewService } from '../../../../../../shared/services/price-review.service';
import { PackageDetailComponent } from '../../../package-detail.component';
import { NgxSpinnerService } from '../../../../../../../../node_modules/ngx-spinner';
import { PackageInfoModel } from '../../../../../../shared/models/package/package-info.model';
import { PackageService } from '../../../../../../shared/services/package.service';
import { Router } from '../../../../../../../../node_modules/@angular/router';
import { AlertService, ConfirmationService } from '../../../../../../shared/services';
import { BidStatus } from '../../../../../../shared/constants/bid-status';
import { Subscription } from '../../../../../../../../node_modules/rxjs/Subscription';
import { PermissionModel } from '../../../../../../shared/models/permission/permission.model';
import { PermissionService } from '../../../../../../shared/services/permission.service';
import { UserModel } from '../../../../../../shared/models/user/user.model';
import { HoSoDuThauService } from '../../../../../../shared/services/ho-so-du-thau.service';
import { DuLieuLiveFormDKDT } from '../../../../../../shared/models/ho-so-du-thau/tom-tat-dkdt.model';
import { CheckStatusPackage } from '../../../../../../shared/constants/check-status-package';

@Component({
  selector: 'app-price-review-form',
  templateUrl: './price-review-form.component.html',
  styleUrls: ['./price-review-form.component.scss']
})
export class PriceReviewFormComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  priceReviewForm: FormGroup;
  package = new PackageInfoModel();
  summary = new DuLieuLiveFormDKDT();
  tenderProposed: any;
  priceReview: TenderPriceApprovalShort;
  bidStatus = BidStatus;

  constructor(
    private fb: FormBuilder,
    private priceReviewService: PriceReviewService,
    private packageService: PackageService,
    private confirmService: ConfirmationService,
    private alertService: AlertService,
    private router: Router,
    private permissionService: PermissionService,
    private hoSoDuThauService: HoSoDuThauService
  ) { }
  isModeView;
  isModeCreate;
  isModeEdit;
  packageId;
  listCustomer;
  showPopupConfirm = false;
  // Variable Check
  valuePcps = false;
  valueOnP = false;

  subscription: Subscription;
  listPermission: Array<PermissionModel>;
  listPermissionScreen = [];
  userModel: UserModel;
  TaoMoiTDG = false;
  XemTDG = false;
  SuaTDG = false;
  XoaTDG = false;
  InTDG = false;
  DuyetTDGTNDuThau = false;
  TaiTemplateTDG = false;
  DuyetTDGTPDuThau = false;
  GuiDuyet = false;
  DuyetTDGBGD = false;
  isShowSendApprovalTime: boolean;
  checkStatusPackage = CheckStatusPackage;
  statusPackage = null;
  isValidateFormNumber = false;
  @Input() model: TenderPriceApproval;
  @Input() type: string;
  @Output() refreshData = new EventEmitter<boolean>();
  static checkDecimalPositiveNumber(input: any): any {
    const regex = /^[^0-9]+|[^0-9]+$/gi;
    return Number(String(input).replace(regex, ''));
  }
  ngOnInit() {
    this.getModeScreen();
    this.packageId = PackageDetailComponent.packageId;
    this.isShowSendApprovalTime = (this.model.sendApprovalTime) ? true : false;
    // Phân quyền
    this.subscription = this.permissionService.get().subscribe(data => {
      this.listPermission = data;
      const hsdt = this.listPermission.length &&
        this.listPermission.filter(x => x.bidOpportunityStage === 'HSDT')[0];
      if (!hsdt) {
        this.listPermissionScreen = [];
      }
      if (hsdt) {
        const screen = hsdt.userPermissionDetails.length
          && hsdt.userPermissionDetails.filter(y => y.permissionGroup.value === 'TrinhDuyetGia')[0];
        if (!screen) {
          this.listPermissionScreen = [];
        }
        if (screen) {
          this.listPermissionScreen = screen.permissions.map(z => z.value);
        }
      }
      this.TaoMoiTDG = this.listPermissionScreen.includes('TaoMoiTDG');
      this.XemTDG = this.listPermissionScreen.includes('XemTDG');
      this.SuaTDG = this.listPermissionScreen.includes('SuaTDG');
      this.XoaTDG = this.listPermissionScreen.includes('XoaTDG');
      this.InTDG = this.listPermissionScreen.includes('InTDG');
      this.DuyetTDGTNDuThau = this.listPermissionScreen.includes('DuyetTDGTNDuThau');
      this.TaiTemplateTDG = this.listPermissionScreen.includes('TaiTemplateTDG');
      this.DuyetTDGTPDuThau = this.listPermissionScreen.includes('DuyetTDGTPDuThau');
      this.GuiDuyet = this.listPermissionScreen.includes('GuiDuyet');
      this.DuyetTDGBGD = this.listPermissionScreen.includes('DuyetTDGBGD');
      setTimeout(() => {
        switch (this.type) {
          case 'create': {
            if (!this.TaoMoiTDG) {
              this.router.navigate(['not-found']);
            }
            break;
          }
          case 'detail': {
            if (!this.XemTDG) {
              this.router.navigate(['not-found']);
            }
            break;
          }
          case 'edit': {
            if (!this.SuaTDG) {
              this.router.navigate(['not-found']);
            }
            break;
          }
        }
      }, 4000);
    });

    const sub = this.permissionService.getUser().subscribe(data => {
      this.userModel = data;
    });

    this.subscription.add(sub);
    this.getAllCustomer();
    this.getDataDefaultMapping();
    this.createForm();
  }

  ngOnChanges() {
    this.createForm();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    const tableReview = $('#table-review').height();
    $('#comment-scroll').height(tableReview + 29);
    $('#comment-scroll').css('min-height', `${tableReview + 29}px`);
  }
  onResize() {
    const tableReview = $('#table-review').height();
    $('#comment-scroll').height(tableReview + 29);
    $('#comment-scroll').css('min-height', `${tableReview + 29}px`);
  }
  getModeScreen() {
    this.isModeView = this.type === 'detail';
    this.isModeCreate = this.type === 'create';
    this.isModeEdit = this.type === 'edit';
  }

  getDataDefaultMapping() {
    this.packageService.getInforPackageID(this.packageId)
      .switchMap(goiThau => {
        this.package = goiThau;
        this.statusPackage = this.checkStatusPackage[goiThau.stageStatus.id];
        if (this.package.stageStatus && this.priceReviewForm.value) {
          if ((this.package.stageStatus.id !== 'DangLapHSDT')
            && (this.package.stageStatus.id !== 'CanLapTrinhDuyetGia')
            && (this.package.stageStatus.id !== 'DaGuiDuyetTrinhDuyetGia')
            && (this.package.stageStatus.id !== 'CanDieuChinhTrinhDuyetGia')) {
            this.priceReviewForm.controls['isApprovedByBoardOfDirector'].disable();
          } else {
            if ((this.userModel && this.userModel.userGroup
              && this.userModel.userGroup.text === 'Admin')) {
              this.priceReviewForm.controls['isApprovedByBoardOfDirector'].enable();
            }
            if ((this.userModel && this.userModel.department
              && this.userModel.department.text === 'BAN TỔNG GIÁM ĐỐC')) {
              this.priceReviewForm.controls['isApprovedByBoardOfDirector'].enable();
            }
            if (this.DuyetTDGTPDuThau || (this.userModel && this.userModel.department
              && this.userModel.department.code === 'PDUTHAU'
              && this.userModel.level && this.userModel.level.code === 'TRUONGPHONG')) {
              this.priceReviewForm.controls['isApprovedByTenderManager'].enable();
            }
            if (this.DuyetTDGTPDuThau || (this.userModel && this.userModel.department
              && this.userModel.department.code === 'PDUTHAU'
              && this.userModel.level && this.userModel.level.code === 'TruongNhom')) {
              this.priceReviewForm.controls['isApprovedByTenderLeader'].enable();
            }
          }
        }
        return this.hoSoDuThauService.getInfoTenderConditionalSummary(this.packageId);
      })
      .switchMap(tomTat => {
        this.summary = tomTat;
        return this.packageService.getProposedTenderParticipateReport(this.packageId);
      })
      .subscribe(phieuDeNghi => {
        this.tenderProposed = phieuDeNghi;

        const tamUngYCPercent = this.tenderProposed
          && this.tenderProposed.contractCondition
          && this.tenderProposed.contractCondition.advancePayment;
        const thoiGianBHMonth = this.tenderProposed
          && this.tenderProposed.contractCondition
          && this.tenderProposed.contractCondition.warrantyPeriod;
        const thoiGianBHMonthDonVi = this.tenderProposed
          && this.tenderProposed.contractCondition
          && this.tenderProposed.contractCondition.warrantyPeriodUnit
          && this.tenderProposed.contractCondition.warrantyPeriodUnit.value;
        const tienGiuLaiYCPercent = this.tenderProposed
          && this.tenderProposed.contractCondition
          && this.tenderProposed.contractCondition.retentionMoney;
        const phatTienDoYCPercent = this.tenderProposed
          && this.tenderProposed.contractCondition
          && this.tenderProposed.contractCondition.delayDamagesForTheWorks;
        const infoGfa = this.package && this.package.floorArea;
        const tienDoThiCongYC = this.tenderProposed && this.tenderProposed
          && this.tenderProposed.contractCondition
          && this.tenderProposed.contractCondition.timeForCompletion;
        const tienDoThiCongCYDonVi = this.tenderProposed && this.tenderProposed
          && this.tenderProposed.contractCondition
          && this.tenderProposed.contractCondition.timeForCompletionUnit
          && this.tenderProposed.contractCondition.timeForCompletionUnit.value;
        const thoiGianDX = this.summary && this.summary.dienGiaiDieuKienHopDong
          && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHBC
          && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHBC.thanhToan
          && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHBC.thanhToan.thoiGianThanhToan;
        const tienGiuLaiDXPercent = this.summary && this.summary.dienGiaiDieuKienHopDong
          && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHBC
          && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHBC.tienGiuLai
          && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHBC.tienGiuLai.phanTram;
        const tienGiuLaiDXKhauTru = this.summary && this.summary.dienGiaiDieuKienHopDong
          && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHBC
          && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHBC.tienGiuLai
          && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHBC.tienGiuLai.gioiHanTienGiuLai;
        const phatTienDoDXPercent = this.summary && this.summary.dienGiaiDieuKienHopDong
          && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHBC
          && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHBC.phatTreTienDo
          && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHBC.phatTreTienDo.phanTram;
        const phatTienDoDXMax = this.summary && this.summary.dienGiaiDieuKienHopDong
          && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHBC
          && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHBC.phatTreTienDo
          && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHBC.phatTreTienDo.gioiHanPhatTienDo;
        const thoiGianYC = this.summary && this.summary.dienGiaiDieuKienHopDong
          && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHSMT
          && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.thanhToan
          && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.thanhToan.thoiGianThanhToan;
        const tienGiuLaiYCKhauTru = this.summary && this.summary.dienGiaiDieuKienHopDong
          && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHSMT
          && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.tienGiuLai
          && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.tienGiuLai.gioiHanTienGiuLai;
        const phatTienDoYCMax = this.summary && this.summary.dienGiaiDieuKienHopDong
          && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHSMT
          && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.phatTreTienDo
          && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.phatTreTienDo.gioiHanPhatTienDo;

        if (this.priceReviewForm) {
          if (tamUngYCPercent) {
            this.priceReviewForm.get('tamUngYCPercent').patchValue(tamUngYCPercent);
          }
          if (tienGiuLaiYCPercent) {
            this.priceReviewForm.get('tienGiuLaiYCPercent').patchValue(tienGiuLaiYCPercent);
          }
          if (phatTienDoYCPercent) {
            this.priceReviewForm.get('phatTienDoYCPercent').patchValue(phatTienDoYCPercent);
          }
          if (infoGfa) {
            this.priceReviewForm.get('infoGfa').patchValue(infoGfa);
          }
          if (tienDoThiCongYC && tienDoThiCongCYDonVi) {
            this.priceReviewForm.get('tienDoThiCongYC').patchValue(`${tienDoThiCongYC} ${tienDoThiCongCYDonVi}`);
          }
          if (thoiGianBHMonth && thoiGianBHMonthDonVi) {
            this.priceReviewForm.get('thoiGianBHMonth').patchValue(`${thoiGianBHMonth} ${thoiGianBHMonthDonVi}`);
          }
          if (thoiGianDX) {
            this.priceReviewForm.get('thoiGianDX').patchValue(thoiGianDX);
          }
          if (tienGiuLaiDXPercent) {
            this.priceReviewForm.get('tienGiuLaiDXPercent').patchValue(tienGiuLaiDXPercent);
          }
          if (tienGiuLaiDXKhauTru) {
            this.priceReviewForm.get('tienGiuLaiDXKhauTru').patchValue(tienGiuLaiDXKhauTru);
          }
          if (phatTienDoDXPercent) {
            this.priceReviewForm.get('phatTienDoDXPercent').patchValue(phatTienDoDXPercent);
          }
          if (phatTienDoDXMax) {
            this.priceReviewForm.get('phatTienDoDXMax').patchValue(phatTienDoDXMax);
          }
          if (thoiGianYC) {
            this.priceReviewForm.get('thoiGianYC').patchValue(thoiGianYC);
          }
          if (tienGiuLaiYCKhauTru) {
            this.priceReviewForm.get('tienGiuLaiYCKhauTru').patchValue(tienGiuLaiYCKhauTru);
          }
          if (phatTienDoYCMax) {
            this.priceReviewForm.get('phatTienDoYCMax').patchValue(phatTienDoYCMax);
          }
        }


      });
  }


  createForm() {
    this.priceReviewForm = this.fb.group({
      // Thông tin dự án
      id: this.model.id,
      otherCompany: {
        value: (this.model.otherCompany) ? this.model.otherCompany : '',
        disabled: this.isModeView
      },
      createdDate: (this.model.createdDate) ? this.model.createdDate : 0,
      infoGfa: this.model.projectInformation && this.model.projectInformation.gfa,
      phanCocCheck: {
        value: this.model.projectInformation
          && this.model.projectInformation.foudationPart
          && this.model.projectInformation.foudationPart.scopeOfWorkIsInclude,
        disabled: this.isModeView
      },
      phanCocDesc: {
        value: this.model.projectInformation
          && this.model.projectInformation.foudationPart
          && this.model.projectInformation.foudationPart.scopeOfWorkDesc,
        disabled: this.isModeView
      },

      phanHamCheck: {
        value: this.model.projectInformation
          && this.model.projectInformation.basementPart
          && this.model.projectInformation.basementPart.scopeOfWorkIsInclude,
        disabled: this.isModeView
      },
      phanHamDesc: {
        value: this.model.projectInformation
          && this.model.projectInformation.basementPart
          && this.model.projectInformation.basementPart.scopeOfWorkDesc,
        disabled: this.isModeView
      },

      ketCauCheck: {
        value: this.model.projectInformation
          && this.model.projectInformation.basementPartConstructionStructure
          && this.model.projectInformation.basementPartConstructionStructure.scopeOfWorkIsInclude,
        disabled: this.isModeView

      },
      ketCauDesc: {
        value: this.model.projectInformation
          && this.model.projectInformation.basementPartConstructionStructure
          && this.model.projectInformation.basementPartConstructionStructure.scopeOfWorkDesc,
        disabled: this.isModeView
      },

      hoanThienCheck: {
        value: this.model.projectInformation
          && this.model.projectInformation.basementPartConstructionCompletion
          && this.model.projectInformation.basementPartConstructionCompletion.scopeOfWorkIsInclude,
        disabled: this.isModeView
      },

      hoanThienDesc: {
        value: this.model.projectInformation
          && this.model.projectInformation.basementPartConstructionCompletion
          && this.model.projectInformation.basementPartConstructionCompletion.scopeOfWorkDesc,
        disabled: this.isModeView

      },
      congViecKhacCheck: {
        value: this.model.projectInformation
          && this.model.projectInformation.basementPartOtherWork
          && this.model.projectInformation.basementPartOtherWork.scopeOfWorkIsInclude,
        disabled: this.isModeView
      },
      congViecKhacDesc: {
        value: this.model.projectInformation
          && this.model.projectInformation.basementPartOtherWork
          && this.model.projectInformation.basementPartOtherWork.scopeOfWorkDesc,
        disabled: this.isModeView
      },
      phanThanCheck: {
        value: this.model.projectInformation
          && this.model.projectInformation.bodyPart
          && this.model.projectInformation.bodyPart.scopeOfWorkIsInclude,
        disabled: this.isModeView

      },
      phanThanDesc: {
        value: this.model.projectInformation
          && this.model.projectInformation.bodyPart
          && this.model.projectInformation.bodyPart.scopeOfWorkDesc,
        disabled: this.isModeView
      },

      phanThanKetCauCheck: {
        value: this.model.projectInformation
          && this.model.projectInformation.bodyPartConstructionStructure
          && this.model.projectInformation.bodyPartConstructionStructure.scopeOfWorkIsInclude,
        disabled: this.isModeView
      },

      phanThanKetCauDesc: {
        value: this.model.projectInformation
          && this.model.projectInformation.bodyPartConstructionStructure
          && this.model.projectInformation.bodyPartConstructionStructure.scopeOfWorkDesc,
        disabled: this.isModeView
      },
      phanThanHoanThienCheck: {
        value: this.model.projectInformation
          && this.model.projectInformation.bodyPartConstructionCompletion
          && this.model.projectInformation.bodyPartConstructionCompletion.scopeOfWorkIsInclude,
        disabled: this.isModeView
      },

      phanThanhoanThienDesc: {
        value: this.model.projectInformation
          && this.model.projectInformation.bodyPartConstructionCompletion
          && this.model.projectInformation.bodyPartConstructionCompletion.scopeOfWorkDesc,
        disabled: this.isModeView
      },

      phanThancongViecKhacCheck: {
        value: this.model.projectInformation
          && this.model.projectInformation.bodyPartOtherWork
          && this.model.projectInformation.bodyPartOtherWork.scopeOfWorkIsInclude,
        disabled: this.isModeView
      },

      phanThancongViecKhacDesc: {
        value: this.model.projectInformation
          && this.model.projectInformation.bodyPartOtherWork
          && this.model.projectInformation.bodyPartOtherWork.scopeOfWorkDesc,
        disabled: this.isModeView
      },
      phanNoiThatCheck: {
        value: this.model.projectInformation
          && this.model.projectInformation.furniture
          && this.model.projectInformation.furniture.scopeOfWorkIsInclude,
        disabled: this.isModeView
      },
      phanNoiThatDesc: {
        value: this.model.projectInformation
          && this.model.projectInformation.furniture
          && this.model.projectInformation.furniture.scopeOfWorkDesc,
        disabled: this.isModeView
      },
      phanCanhQuanCheck: {
        value: this.model.projectInformation
          && this.model.projectInformation.view
          && this.model.projectInformation.view.scopeOfWorkIsInclude,
        disabled: this.isModeView
      },
      phanCanhQuanDesc: {
        value: this.model.projectInformation
          && this.model.projectInformation.view
          && this.model.projectInformation.view.scopeOfWorkDesc,
        disabled: this.isModeView
      },
      phanCoDienCheck: {
        value: this.model.projectInformation
          && this.model.projectInformation.electromechanic
          && this.model.projectInformation.electromechanic.scopeOfWorkIsInclude,
        disabled: this.isModeView
      },
      phanCoDienDesc: {
        value: this.model.projectInformation
          && this.model.projectInformation.electromechanic
          && this.model.projectInformation.electromechanic.scopeOfWorkDesc,
        disabled: this.isModeView
      },
      phanDienCheck: {
        value: this.model.projectInformation
          && this.model.projectInformation.electromechanicElectricity
          && this.model.projectInformation.electromechanicElectricity.scopeOfWorkIsInclude,
        disabled: this.isModeView
      },
      phanDienDesc: {
        value: this.model.projectInformation
          && this.model.projectInformation.electromechanicElectricity
          && this.model.projectInformation.electromechanicElectricity.scopeOfWorkDesc,
        disabled: this.isModeView
      },
      phanCoCheck: {
        value: this.model.projectInformation
          && this.model.projectInformation.electromechanicMechanic
          && this.model.projectInformation.electromechanicMechanic.scopeOfWorkIsInclude,
        disabled: this.isModeView
      },
      phanCoDesc: {
        value: this.model.projectInformation
          && this.model.projectInformation.electromechanicMechanic
          && this.model.projectInformation.electromechanicMechanic.scopeOfWorkDesc,
        disabled: this.isModeView
      },
      phanNuocCheck: {
        value: this.model.projectInformation
          && this.model.projectInformation.electromechanicWater
          && this.model.projectInformation.electromechanicWater.scopeOfWorkIsInclude,
        disabled: this.isModeView
      },
      phanNuocDesc: {
        value: this.model.projectInformation
          && this.model.projectInformation.electromechanicWater
          && this.model.projectInformation.electromechanicWater.scopeOfWorkDesc,
        disabled: this.isModeView
      },
      phanCoDienCongViecKhacCheck: {
        value: this.model.projectInformation
          && this.model.projectInformation.electromechanicOtherWork
          && this.model.projectInformation.electromechanicOtherWork.scopeOfWorkIsInclude,
        disabled: this.isModeView
      },
      phanCoDienCongViecKhacDesc: {
        value: this.model.projectInformation
          && this.model.projectInformation.electromechanicOtherWork
          && this.model.projectInformation.electromechanicOtherWork.scopeOfWorkDesc,
        disabled: this.isModeView
      },
      // Kỹ thuật
      tienDoThiCongYC: this.model.technique
        && this.model.technique.constructionProgress
        && this.model.technique.constructionProgress.folowTenderDocumentRequirement,

      tienDoThiCongDX: {
        value: this.model.technique
          && this.model.technique.constructionProgress
          && this.model.technique.constructionProgress.suggestion,
        disabled: this.isModeView
      },

      tienDoThiCongCY: {
        value: this.model.technique
          && this.model.technique.constructionProgress
          && this.model.technique.constructionProgress.note,
        disabled: this.isModeView
      },

      bienPhapThiCongYC: {
        value: this.model.technique
          && this.model.technique.specialFeatureOfConstructionMethod
          && this.model.technique.specialFeatureOfConstructionMethod.folowTenderDocumentRequirement,
        disabled: this.isModeView
      },

      bienPhapThiCongDX: {
        value: this.model.technique
          && this.model.technique.specialFeatureOfConstructionMethod
          && this.model.technique.specialFeatureOfConstructionMethod.suggestion,
        disabled: this.isModeView
      },

      bienPhapThiCongCY: {
        value: this.model.technique
          && this.model.technique.specialFeatureOfConstructionMethod
          && this.model.technique.specialFeatureOfConstructionMethod.note,
        disabled: this.isModeView
      },
      yeuCauAnToanYC: {
        value: this.model.technique
          && this.model.technique.safetyRequirement
          && this.model.technique.safetyRequirement.folowTenderDocumentRequirement,
        disabled: this.isModeView
      },
      yeuCauAntoanDX: {
        value: this.model.technique
          && this.model.technique.safetyRequirement
          && this.model.technique.safetyRequirement.suggestion,
        disabled: this.isModeView
      },
      yeuCauAnToanCY: {
        value: this.model.technique
          && this.model.technique.safetyRequirement
          && this.model.technique.safetyRequirement.note,
        disabled: this.isModeView
      },

      yeuCauKhacYC: {
        value: this.model.technique
          && this.model.technique.otherSpecialRequirement
          && this.model.technique.otherSpecialRequirement.folowTenderDocumentRequirement,
        disabled: this.isModeView
      },
      yeuCauKhacCY: {
        value: this.model.technique
          && this.model.technique.otherSpecialRequirement
          && this.model.technique.otherSpecialRequirement.note,
        disabled: this.isModeView
      },

      // Điều kiện hợp đồng

      tamUngYCPercent: this.model.contractCondition
        && this.model.contractCondition.advanceMoney
        && this.model.contractCondition.advanceMoney.tenderDocumentRequirementPercent,

      tamUngYCKhauTru: {
        value: this.model.contractCondition
          && this.model.contractCondition.advanceMoney
          && PriceReviewFormComponent.checkDecimalPositiveNumber(this.model.contractCondition
            .advanceMoney.tenderDocumentRequirementDiscountPercent),
        disabled: this.isModeView
      },

      tamUngDXPercent: {
        value: this.model.contractCondition
          && this.model.contractCondition.advanceMoney
          && PriceReviewFormComponent.checkDecimalPositiveNumber(this.model.contractCondition.advanceMoney.suggestionPercent),
        disabled: this.isModeView
      },

      tamUngDXKhauTru: {
        value: this.model.contractCondition
          && this.model.contractCondition.advanceMoney
          && PriceReviewFormComponent.checkDecimalPositiveNumber(this.model.contractCondition.advanceMoney.suggestionDiscountPercent),
        disabled: this.isModeView
      },
      tamUngCY: {
        value: this.model.contractCondition
          && this.model.contractCondition.advanceMoney
          && this.model.contractCondition.advanceMoney.note,
        disabled: this.isModeView
      },
      thoiGianYC: this.model.contractCondition
        && this.model.contractCondition.paymentTime
        && this.model.contractCondition.paymentTime.tenderDocumentRequirementDay,
      thoiGianDX: this.model.contractCondition
        && this.model.contractCondition.paymentTime
        && this.model.contractCondition.paymentTime.suggestionDay,
      thoiGianCY: {
        value: this.model.contractCondition
          && this.model.contractCondition.paymentTime
          && this.model.contractCondition.paymentTime.note,
        disabled: this.isModeView
      },
      tienGiuLaiYCPercent: this.model.contractCondition
        && this.model.contractCondition.retainedMoney
        && this.model.contractCondition.retainedMoney.tenderDocumentRequirementPercent,
      tienGiuLaiYCKhauTru: this.model.contractCondition
        && this.model.contractCondition.retainedMoney
        && this.model.contractCondition.retainedMoney.tenderDocumentRequirementMaxPercent,
      tienGiuLaiDXPercent: this.model.contractCondition
        && this.model.contractCondition.retainedMoney
        && this.model.contractCondition.retainedMoney.requirementPercent,
      tienGiuLaiDXKhauTru: this.model.contractCondition
        && this.model.contractCondition.retainedMoney
        && this.model.contractCondition.retainedMoney.requirementMaxPercent,
      tienGiuLaiCY: {
        value: this.model.contractCondition
          && this.model.contractCondition.retainedMoney
          && this.model.contractCondition.retainedMoney.note,
        disabled: this.isModeView
      },

      phatTienDoYCPercent: this.model.contractCondition
        && this.model.contractCondition.punishDelay
        && this.model.contractCondition.punishDelay.tenderDocumentRequirementPercent,
      phatTienDoYCMax: this.model.contractCondition
        && this.model.contractCondition.punishDelay
        && this.model.contractCondition.punishDelay.tenderDocumentRequirementMax,
      phatTienDoDXPercent: this.model.contractCondition
        && this.model.contractCondition.punishDelay
        && this.model.contractCondition.punishDelay.suggestionPercent,
      phatTienDoDXMax: this.model.contractCondition
        && this.model.contractCondition.punishDelay
        && this.model.contractCondition.punishDelay.suggestionMax,
      phatTienDoCY: {
        value: this.model.contractCondition
          && this.model.contractCondition.punishDelay
          && this.model.contractCondition.punishDelay.note,
        disabled: this.isModeView
      },


      thoiGianBHYCPercent: {
        value: this.model.contractCondition
          && this.model.contractCondition.constructionWarrantyTime
          && PriceReviewFormComponent.checkDecimalPositiveNumber(this.model.contractCondition.constructionWarrantyTime.percent),
        disabled: this.isModeView
      },
      thoiGianBHYCAmount: {
        value: this.model.contractCondition
          && this.model.contractCondition.constructionWarrantyTime
          && this.model.contractCondition.constructionWarrantyTime.money,
        disabled: this.isModeView
      },
      thoiGianBHDXBond: {
        value: this.model.contractCondition
          && this.model.contractCondition.constructionWarrantyTime
          && this.model.contractCondition.constructionWarrantyTime.bond,
        disabled: this.isModeView
      },
      thoiGianBHMonth: this.model.contractCondition
        && this.model.contractCondition.constructionWarrantyTime
        && this.model.contractCondition.constructionWarrantyTime.month,
      thoiGianBHCY: {
        value: this.model.contractCondition
          && this.model.contractCondition.constructionWarrantyTime
          && this.model.contractCondition.constructionWarrantyTime.note,
        disabled: this.isModeView
      },
      dieuKienDacBiet: {
        value: this.model.contractCondition
          && this.model.contractCondition.disadvantage
          && this.model.contractCondition.disadvantage.disadvantageName,
        disabled: this.isModeView
      },
      dieuKienDacBietCY: {
        value: this.model.contractCondition
          && this.model.contractCondition.disadvantage
          && this.model.contractCondition.disadvantage.note,
        disabled: this.isModeView
      },
      // Gia thau

      giaVonBaseAmount: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapital
          && this.model.tentativeTenderPrice.costOfCapital.baseTenderAmount,
        disabled: true
      },
      giaVonBaseGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapital
          && this.model.tentativeTenderPrice.costOfCapital.baseTenderGFA,
        disabled: true
      },
      giaVonAlterAmount: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapital
          && this.model.tentativeTenderPrice.costOfCapital.alternativeTenderAmount,
        disabled: true
      },
      giaVonAlterGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapital
          && this.model.tentativeTenderPrice.costOfCapital.alternativeTenderGFA,
        disabled: true
      },
      giaVonCY: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapital
          && this.model.tentativeTenderPrice.costOfCapital.note,
        disabled: this.isModeView
      },
      chiPhiBaseAmount: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapitalGeneralCost
          && PriceReviewFormComponent.checkDecimalPositiveNumber(this.model.tentativeTenderPrice.costOfCapitalGeneralCost.baseTenderAmount),
        disabled: this.isModeView
      },
      chiPhiBaseGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapitalGeneralCost
          && PriceReviewFormComponent.checkDecimalPositiveNumber(this.model.tentativeTenderPrice.costOfCapitalGeneralCost.baseTenderGFA),
        disabled: this.isModeView
      },
      chiPhiAlterAmount: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapitalGeneralCost
          && PriceReviewFormComponent.checkDecimalPositiveNumber(this.model.tentativeTenderPrice
            .costOfCapitalGeneralCost.alternativeTenderAmount),
        disabled: this.isModeView
      },
      chiPhiAlterGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapitalGeneralCost
          && PriceReviewFormComponent.checkDecimalPositiveNumber(this.model.tentativeTenderPrice
            .costOfCapitalGeneralCost.alternativeTenderGFA),
        disabled: this.isModeView
      },
      chiPhiAlterNote: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapitalGeneralCost
          && this.model.tentativeTenderPrice.costOfCapitalGeneralCost.note,
        disabled: this.isModeView
      },
      giaTriBaseAmount: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapitalValue
          && PriceReviewFormComponent.checkDecimalPositiveNumber(this.model.tentativeTenderPrice.costOfCapitalValue.baseTenderAmount),
        disabled: this.isModeView
      },
      giaTriBaseGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapitalValue
          && PriceReviewFormComponent.checkDecimalPositiveNumber(this.model.tentativeTenderPrice.costOfCapitalValue.baseTenderGFA),
        disabled: this.isModeView
      },
      giaTriAlterAmount: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapitalValue
          && PriceReviewFormComponent.checkDecimalPositiveNumber(this.model.tentativeTenderPrice
            .costOfCapitalValue.alternativeTenderAmount),
        disabled: this.isModeView
      },
      giaTriAlterGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapitalValue
          && PriceReviewFormComponent.checkDecimalPositiveNumber(this.model.tentativeTenderPrice.costOfCapitalValue.alternativeTenderGFA),
        disabled: this.isModeView
      },
      giaTriNote: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapitalValue
          && this.model.tentativeTenderPrice.costOfCapitalValue.note,
        disabled: this.isModeView
      },

      giaTriPCBaseAmount: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfNSC
          && PriceReviewFormComponent.checkDecimalPositiveNumber(this.model.tentativeTenderPrice.costOfNSC.baseTenderAmount),
        disabled: this.isModeView
      },
      giaTriPCBaseGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfNSC
          && PriceReviewFormComponent.checkDecimalPositiveNumber(this.model.tentativeTenderPrice.costOfNSC.baseTenderGFA),
        disabled: this.isModeView
      },
      giaTriPCAlterAmount: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfNSC
          && PriceReviewFormComponent.checkDecimalPositiveNumber(this.model.tentativeTenderPrice
            .costOfNSC.alternativeTenderAmount),
        disabled: this.isModeView
      },
      giaTriPCAlterGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfNSC
          && PriceReviewFormComponent.checkDecimalPositiveNumber(this.model.tentativeTenderPrice
            .costOfNSC.alternativeTenderGFA),
        disabled: this.isModeView
      },
      giaTriPCNote: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfNSC
          && this.model.tentativeTenderPrice.costOfNSC.note,
        disabled: this.isModeView
      },
      giaTriNhaThauTrucTiepBaseAmount: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.directContractorCost
          && PriceReviewFormComponent.checkDecimalPositiveNumber(this.model.tentativeTenderPrice.directContractorCost.baseTenderAmount),
        disabled: this.isModeView
      },
      giaTriNhaThauTrucTiepBaseGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.directContractorCost
          && PriceReviewFormComponent.checkDecimalPositiveNumber(this.model.tentativeTenderPrice.directContractorCost.baseTenderGFA),
        disabled: this.isModeView
      },
      giaTriNhaThauTrucTiepAlterAmount: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.directContractorCost
          && PriceReviewFormComponent
            .checkDecimalPositiveNumber(this.model.tentativeTenderPrice.directContractorCost.alternativeTenderAmount),
        disabled: this.isModeView
      },
      giaTriNhaThauTrucTiepAlterGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.directContractorCost
          && PriceReviewFormComponent.checkDecimalPositiveNumber(this.model.tentativeTenderPrice.directContractorCost.alternativeTenderGFA),
        disabled: this.isModeView
      },
      giaTriNhaThauTrucTiepNote: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.directContractorCost
          && this.model.tentativeTenderPrice.directContractorCost.note,
        disabled: this.isModeView
      },
      // RQ.

      totalGiaVonAmount: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.totalCostOfCapital
          && this.model.tentativeTenderPrice.totalCostOfCapital.baseTenderAmount,
        disabled: this.isModeView
      },
      totalGiaVonGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.totalCostOfCapital
          && this.model.tentativeTenderPrice.totalCostOfCapital.baseTenderGFA,
        disabled: this.isModeView
      },
      totalAlterAmount: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.totalCostOfCapital
          && this.model.tentativeTenderPrice.totalCostOfCapital.alternativeTenderAmount,
        disabled: this.isModeView
      },
      totalAlterGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.totalCostOfCapital
          && PriceReviewFormComponent.checkDecimalPositiveNumber(this.model.tentativeTenderPrice.totalCostOfCapital.alternativeTenderGFA),
        disabled: this.isModeView
      },

      totalGiaVonNote: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.totalCostOfCapital
          && this.model.tentativeTenderPrice.totalCostOfCapital.note,
        disabled: this.isModeView
      },

      chiPhiLoiNhuanAmountGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.totalCostOfCapitalProfitCost
          && PriceReviewFormComponent.checkDecimalPositiveNumber(this.model.tentativeTenderPrice
            .totalCostOfCapitalProfitCost.baseTenderProfitCost),
        disabled: this.isModeView
      },
      chiPhiLoiNhuanAlterAmountGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.totalCostOfCapitalProfitCost
          && PriceReviewFormComponent.checkDecimalPositiveNumber(this.model.tentativeTenderPrice
            .totalCostOfCapitalProfitCost.alternativeProfitCost),
        disabled: this.isModeView
      },
      chiPhiLoiNhuanNote: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.totalCostOfCapitalProfitCost
          && this.model.tentativeTenderPrice.totalCostOfCapitalProfitCost.note,
        disabled: this.isModeView
      },
      giaDiNopThauAmount: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.totalCostOfSubmission
          && this.model.tentativeTenderPrice.totalCostOfSubmission.baseTenderAmount,
        disabled: this.isModeView
      },
      giaDiNopThauGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.totalCostOfSubmission
          && this.model.tentativeTenderPrice.totalCostOfSubmission.baseTenderGFA,
        disabled: this.isModeView
      },
      giaDiNopThauAlterAmount: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.totalCostOfSubmission
          && PriceReviewFormComponent.checkDecimalPositiveNumber(this.model.tentativeTenderPrice
            .totalCostOfSubmission.alternativeTenderAmount),
        disabled: this.isModeView
      },
      giaDiNopThauAlterGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.totalCostOfSubmission
          && PriceReviewFormComponent.checkDecimalPositiveNumber(this.model.tentativeTenderPrice
            .totalCostOfSubmission.alternativeTenderGFA),
        disabled: this.isModeView
      },
      giaDiNopThauNote: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.totalCostOfSubmission
          && this.model.tentativeTenderPrice.totalCostOfSubmission.note,
        disabled: this.isModeView
      },
      tyleAmount: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.oAndPPercentOfTotalCost
          && this.model.tentativeTenderPrice.oAndPPercentOfTotalCost.baseTenderAmount,
        disabled: this.isModeView
      },
      tyleGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.oAndPPercentOfTotalCost
          && this.model.tentativeTenderPrice.oAndPPercentOfTotalCost.baseTenderGFA,
        disabled: this.isModeView
      },
      tyleAlter: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.oAndPPercentOfTotalCost
          && PriceReviewFormComponent.checkDecimalPositiveNumber(this.model.tentativeTenderPrice
            .oAndPPercentOfTotalCost.alternativeTenderAmount),
        disabled: this.isModeView
      },
      tyLeNote: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.oAndPPercentOfTotalCost
          && this.model.tentativeTenderPrice.oAndPPercentOfTotalCost.note,
        disabled: this.isModeView
      },
      approvalDate:
        DateTimeConvertHelper.fromTimestampToDtObject(
          this.model.approvalDate * 1000),
      approvalTimes: {
        value: this.model.approvalTimes,
        disabled: this.isModeView
      },
      interviewTimes: {
        value: (this.model.interviewTimes !== 0) ? this.model.interviewTimes : 1,
        disabled: this.isModeView
      },
      isApprovedByTenderLeader: { value: this.model.isApprovedByTenderLeader, disabled: true },
      isApprovedByTenderManager: { value: this.model.isApprovedByTenderManager, disabled: true },
      isApprovedByBoardOfDirector: { value: this.model.isApprovedByBoardOfDirector, disabled: true },
      bidOpportunityId: this.model.bidOpportunityId ? this.model.bidOpportunityId : this.packageId,
      createdEmployeeId: this.model.createdEmployee && this.model.createdEmployee.employeeId,
      updatedEmployeeId: this.model.updatedEmployee && this.model.updatedEmployee.employeeId,
      isDraftVersion: this.model.isDraftVersion,
      documentName: {
        value: this.model.documentName,
        disabled: this.isModeView
      },
      updatedDesc: ''
    });

    const tamUngYCPercent = this.tenderProposed
      && this.tenderProposed.contractCondition
      && this.tenderProposed.contractCondition.advancePayment;
    const thoiGianBHMonth = this.tenderProposed
      && this.tenderProposed.contractCondition
      && this.tenderProposed.contractCondition.warrantyPeriod;
    const thoiGianBHMonthDonVi = this.tenderProposed
      && this.tenderProposed.contractCondition
      && this.tenderProposed.contractCondition.warrantyPeriodUnit
      && this.tenderProposed.contractCondition.warrantyPeriodUnit.value;

    const tienGiuLaiYCPercent = this.tenderProposed
      && this.tenderProposed.contractCondition
      && this.tenderProposed.contractCondition.retentionMoney;
    const phatTienDoYCPercent = this.tenderProposed
      && this.tenderProposed.contractCondition
      && this.tenderProposed.contractCondition.delayDamagesForTheWorks;

    const infoGfa = this.package && this.package.floorArea;
    const tienDoThiCongYC = this.tenderProposed && this.tenderProposed
      && this.tenderProposed.contractCondition
      && this.tenderProposed.contractCondition.timeForCompletion;
    const tienDoThiCongCYDonVi = this.tenderProposed && this.tenderProposed
      && this.tenderProposed.contractCondition
      && this.tenderProposed.contractCondition.timeForCompletionUnit
      && this.tenderProposed.contractCondition.timeForCompletionUnit.value;
    const thoiGianDX = this.summary && this.summary.dienGiaiDieuKienHopDong
      && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHBC
      && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHBC.thanhToan
      && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHBC.thanhToan.thoiGianThanhToan;
    const tienGiuLaiDXPercent = this.summary && this.summary.dienGiaiDieuKienHopDong
      && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHBC
      && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHBC.tienGiuLai
      && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHBC.tienGiuLai.phanTram;
    const tienGiuLaiDXKhauTru = this.summary && this.summary.dienGiaiDieuKienHopDong
      && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHBC
      && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHBC.tienGiuLai
      && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHBC.tienGiuLai.gioiHanTienGiuLai;
    const phatTienDoDXPercent = this.summary && this.summary.dienGiaiDieuKienHopDong
      && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHBC
      && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHBC.phatTreTienDo
      && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHBC.phatTreTienDo.phanTram;
    const phatTienDoDXMax = this.summary && this.summary.dienGiaiDieuKienHopDong
      && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHBC
      && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHBC.phatTreTienDo
      && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHBC.phatTreTienDo.gioiHanPhatTienDo;



    const thoiGianYC = this.summary && this.summary.dienGiaiDieuKienHopDong
      && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHSMT
      && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.thanhToan
      && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.thanhToan.thoiGianThanhToan;
    const tienGiuLaiYCKhauTru = this.summary && this.summary.dienGiaiDieuKienHopDong
      && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHSMT
      && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.tienGiuLai
      && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.tienGiuLai.gioiHanTienGiuLai;
    const phatTienDoYCMax = this.summary && this.summary.dienGiaiDieuKienHopDong
      && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHSMT
      && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.phatTreTienDo
      && this.summary.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.phatTreTienDo.gioiHanPhatTienDo;

    if (this.priceReviewForm) {
      if (tamUngYCPercent) {
        this.priceReviewForm.get('tamUngYCPercent').patchValue(tamUngYCPercent);
      }
      if (tienGiuLaiYCPercent) {
        this.priceReviewForm.get('tienGiuLaiYCPercent').patchValue(tienGiuLaiYCPercent);
      }
      if (phatTienDoYCPercent) {
        this.priceReviewForm.get('phatTienDoYCPercent').patchValue(phatTienDoYCPercent);
      }
      if (infoGfa) {
        this.priceReviewForm.get('infoGfa').patchValue(infoGfa);
      }
      if (tienDoThiCongYC && tienDoThiCongCYDonVi) {
        this.priceReviewForm.get('tienDoThiCongYC').patchValue(`${tienDoThiCongYC} ${tienDoThiCongCYDonVi}`);
      }
      if (thoiGianBHMonth && thoiGianBHMonthDonVi) {
        this.priceReviewForm.get('thoiGianBHMonth').patchValue(`${thoiGianBHMonth} ${thoiGianBHMonthDonVi}`);
      }
      if (thoiGianDX) {
        this.priceReviewForm.get('thoiGianDX').patchValue(thoiGianDX);
      }
      if (tienGiuLaiDXPercent) {
        this.priceReviewForm.get('tienGiuLaiDXPercent').patchValue(tienGiuLaiDXPercent);
      }
      if (tienGiuLaiDXKhauTru) {
        this.priceReviewForm.get('tienGiuLaiDXKhauTru').patchValue(tienGiuLaiDXKhauTru);
      }
      if (phatTienDoDXPercent) {
        this.priceReviewForm.get('phatTienDoDXPercent').patchValue(phatTienDoDXPercent);
      }
      if (phatTienDoDXMax) {
        this.priceReviewForm.get('phatTienDoDXMax').patchValue(phatTienDoDXMax);
      }
      if (thoiGianYC) {
        this.priceReviewForm.get('thoiGianYC').patchValue(thoiGianYC);
      }
      if (tienGiuLaiYCKhauTru) {
        this.priceReviewForm.get('tienGiuLaiYCKhauTru').patchValue(tienGiuLaiYCKhauTru);
      }
      if (phatTienDoYCMax) {
        this.priceReviewForm.get('phatTienDoYCMax').patchValue(phatTienDoYCMax);
      }
    }

    if (this.package.stageStatus && this.priceReviewForm.value) {
      if ((this.package.stageStatus.id !== 'DangLapHSDT')
        && (this.package.stageStatus.id !== 'CanLapTrinhDuyetGia')
        && (this.package.stageStatus.id !== 'DaGuiDuyetTrinhDuyetGia')
        && (this.package.stageStatus.id !== 'CanDieuChinhTrinhDuyetGia')) {
        this.priceReviewForm.controls['isApprovedByBoardOfDirector'].disable();
      } else {
        if ((this.userModel && this.userModel.userGroup
          && this.userModel.userGroup.text === 'Admin')) {
          this.priceReviewForm.controls['isApprovedByBoardOfDirector'].enable();
        }
        if ((this.userModel && this.userModel.department
          && this.userModel.department.text === 'BAN TỔNG GIÁM ĐỐC')) {
          this.priceReviewForm.controls['isApprovedByBoardOfDirector'].enable();
        }
        if (this.DuyetTDGTPDuThau || (this.userModel && this.userModel.department
          && this.userModel.department.code === 'PDUTHAU'
          && this.userModel.level && this.userModel.level.code === 'TRUONGPHONG')) {
          this.priceReviewForm.controls['isApprovedByTenderManager'].enable();
        }
        if (this.DuyetTDGTPDuThau || (this.userModel && this.userModel.department
          && this.userModel.department.code === 'PDUTHAU'
          && this.userModel.level && this.userModel.level.code === 'TruongNhom')) {
          this.priceReviewForm.controls['isApprovedByTenderLeader'].enable();
        }
      }

    }
    if (this.priceReviewForm.value) {
      const tempApprovalTimes = (this.model.sendApprovalTime) ? this.model.sendApprovalTime : null;
      if (!this.priceReviewForm.get('approvalDate').value) {
        this.priceReviewForm.get('approvalDate').patchValue(
          DateTimeConvertHelper.fromTimestampToDtObject(
            tempApprovalTimes * 1000)
        );
      }
      this.checkDuyet();
    }

    this.priceReviewForm.valueChanges.subscribe(data => {
      this.checkNumberInvalid();
    });
  }

  checkNumberInvalid() {
    if (
      !(
        (!this.priceReviewForm.get('interviewTimes').value || Number(this.priceReviewForm.get('interviewTimes').value))
        && (!this.priceReviewForm.get('tamUngYCKhauTru').value || Number(this.priceReviewForm.get('tamUngYCKhauTru').value))
        && (!this.priceReviewForm.get('tamUngDXPercent').value || Number(this.priceReviewForm.get('tamUngDXPercent').value))
        && (!this.priceReviewForm.get('tamUngDXKhauTru').value || Number(this.priceReviewForm.get('tamUngDXKhauTru').value))
        && (!this.priceReviewForm.get('thoiGianBHYCPercent').value || Number(this.priceReviewForm.get('thoiGianBHYCPercent').value))
        && (!this.priceReviewForm.get('chiPhiBaseAmount').value || Number(this.priceReviewForm.get('chiPhiBaseAmount').value))
        && (!this.priceReviewForm.get('chiPhiAlterAmount').value || Number(this.priceReviewForm.get('chiPhiAlterAmount').value))
        && (!this.priceReviewForm.get('giaTriBaseAmount').value || Number(this.priceReviewForm.get('giaTriBaseAmount').value))
        && (!this.priceReviewForm.get('giaTriAlterAmount').value || Number(this.priceReviewForm.get('giaTriAlterAmount').value))
        && (!this.priceReviewForm.get('giaTriPCBaseAmount').value || Number(this.priceReviewForm.get('giaTriPCBaseAmount').value))
        && (!this.priceReviewForm.get('giaTriPCAlterAmount').value || Number(this.priceReviewForm.get('giaTriPCAlterAmount').value))
        // tslint:disable-next-line:max-line-length
        && (!this.priceReviewForm.get('giaTriNhaThauTrucTiepBaseAmount').value || Number(this.priceReviewForm.get('giaTriNhaThauTrucTiepBaseAmount').value))
        // tslint:disable-next-line:max-line-length
        && (!this.priceReviewForm.get('giaTriNhaThauTrucTiepAlterAmount').value || Number(this.priceReviewForm.get('giaTriNhaThauTrucTiepAlterAmount').value))
        && (!this.priceReviewForm.get('chiPhiLoiNhuanAmountGfa').value || Number(this.priceReviewForm.get('chiPhiLoiNhuanAmountGfa').value))
        // tslint:disable-next-line:max-line-length
        && (!this.priceReviewForm.get('chiPhiLoiNhuanAlterAmountGfa').value || Number(this.priceReviewForm.get('chiPhiLoiNhuanAlterAmountGfa').value))
      )
    ) {
      this.isValidateFormNumber = true;
    } else {
      this.isValidateFormNumber = false;
    }
  }

  submit(isSaveDraft: boolean) {
    if (isSaveDraft) {
      this.priceReviewForm.get('isDraftVersion').patchValue(true);
      this.priceReviewForm.get('updatedDesc').patchValue('');
      this.priceReviewService.createOrEdit(this.priceReviewForm.value, this.packageId).subscribe(() => {
        this.router.navigate([`/package/detail/${this.packageId}/attend/price-review`]);
        const message = (this.isModeCreate) ? 'Tạo' : 'Cập nhật';
        this.alertService.success(`${message} Trình duyệt giá thành công!`);
      }, err => {
        const message = (this.isModeCreate) ? 'Tạo' : 'Cập nhật';
        this.alertService.error(`Đã có lỗi xảy ra. ${message} Trình duyệt giá không thành công!`);
      });
    } else {
      const previousStatus = this.priceReviewForm.get('isDraftVersion').value;
      this.priceReviewForm.get('isDraftVersion').patchValue(false);
      if (this.isModeCreate || previousStatus) {
        this.priceReviewForm.get('updatedDesc').patchValue('');
        this.priceReviewService.createOrEdit(this.priceReviewForm.value, this.packageId).subscribe(() => {
          this.router.navigate([`/package/detail/${this.packageId}/attend/price-review`]);
          const message = (this.isModeCreate) ? 'Tạo' : 'Cập nhật';
          this.alertService.success(`${message} Trình duyệt giá thành công!`);
        }, err => {
          const message = (this.isModeCreate) ? 'Tạo' : 'Cập nhật';
          this.alertService.error(`Đã có lỗi xảy ra. ${message} Trình duyệt giá không thành công!`);
        });
      } else {
        this.showPopupConfirm = true;
      }
    }
  }
  submitLiveForm(check) {
    if (check === false) {
      this.showPopupConfirm = false;
    } else {
      this.priceReviewForm.get('updatedDesc').patchValue(check);
      this.priceReviewService.createOrEdit(this.priceReviewForm.value, this.packageId).subscribe(() => {
        this.router.navigate([`/package/detail/${this.packageId}/attend/price-review`]);
        const message = (this.isModeCreate) ? 'Tạo' : 'Cập nhật';
        this.alertService.success(`${message} Trình duyệt giá thành công!`);
      }, err => {
        const message = (this.isModeCreate) ? 'Tạo' : 'Cập nhật';
        this.alertService.error(`Đã có lỗi xảy ra. ${message} Trình duyệt giá không thành công!`);
      });
    }
  }

  refresh() {
    this.refreshData.emit(true);
  }


  truongNhomKhongDuyet() {
    const isApprovedByTenderLeader = this.priceReviewForm.get('isApprovedByTenderLeader').value;
    // if (isApprovedByTenderLeader) {
    this.priceReviewService.truongNhomKhongDuyet(this.packageId).subscribe(() => {
    }, err => this.alertService.error('Đã có lỗi xảy ra. Xin vui lòng thử lại.'));
    // }
  }

  truongNhomDuyet() {
    const isApprovedByTenderLeader = this.priceReviewForm.get('isApprovedByTenderLeader').value;
    // if (!isApprovedByTenderLeader) {
    this.priceReviewService.truongNhomDuyet(this.packageId).subscribe(() => {
    }, err => this.alertService.error('Đã có lỗi xảy ra. Xin vui lòng thử lại.'));
    // }
  }

  truongPhongDuyet() {
    const isApprovedByTenderManager = this.priceReviewForm.get('isApprovedByTenderManager').value;
    // if (!isApprovedByTenderManager) {
    this.priceReviewService.truongPhongDuyet(this.packageId).subscribe(() => {
    }, err => this.alertService.error('Đã có lỗi xảy ra. Xin vui lòng thử lại.'));
    // }
  }

  truongPhongKhongDuyet() {
    const isApprovedByTenderManager = this.priceReviewForm.get('isApprovedByTenderManager').value;
    // if (isApprovedByTenderManager) {
    this.priceReviewService.truongPhongKhongDuyet(this.packageId).subscribe(() => {
    }, err => this.alertService.error('Đã có lỗi xảy ra. Xin vui lòng thử lại.'));
    // }
  }

  giamDocDuyet() {
    // const isApprovedByBoardOfDirector = this.priceReviewForm.get('isApprovedByBoardOfDirector').value;
    // if (!isApprovedByBoardOfDirector) {
    // Giám đốc luôn dc duyệt
      this.priceReviewService.giamDocDuyet(this.packageId).subscribe(() => {
        this.checkDuyet();
        this.alertService.success('Duyệt trình duyệt giá thành công!');
      }, err => {
        this.priceReviewForm.get('isApprovedByBoardOfDirector').patchValue(null);
        const error = err.json();
        if (error.errorCode === 'BusinessException') {
          this.alertService.error(`${error.errorMessage}`);
        } else {
          this.alertService.error(`Đã có lỗi xảy ra. Xin vui lòng thử lại.`);
        }
      });
    // }
  }

  giamDocKhongDuyet() {
    this.priceReviewService.giamDocKhongDuyet(this.packageId).subscribe(() => {
      this.checkDuyet();
      this.router.navigate([`package/detail/${this.packageId}/attend/price-review/summary`]);
      this.alertService.success('Không duyệt trình duyệt giá thành công!');
    }, err => {
      this.priceReviewForm.get('isApprovedByBoardOfDirector').patchValue(null);
      const error = err.json();
      if (error.errorCode === 'BusinessException') {
        this.alertService.error(`${error.errorMessage}`);
      } else {
        this.alertService.error(`Đã có lỗi xảy ra. Xin vui lòng thử lại.`);
      }
    });
  }

  checkDuyet() {

    if (this.isModeView) {
      this.priceReviewForm.controls['approvalDate'].disable();
    }

  }
  getAllCustomer() {
    this.priceReviewService.getAllCustomer().subscribe(customers => {
      this.listCustomer = customers;
    });
  }

  // Gủi duyệt
  guiDuyet() {
    const dieuKienGuiDuyet = (this.priceReviewForm.get('isApprovedByTenderLeader').value !== null &&
      this.priceReviewForm.get('isApprovedByTenderManager').value !== null);
    if ((this.model.isApprovedByTenderLeader == null || this.model.isApprovedByTenderManager == null) && !dieuKienGuiDuyet) {
      this.confirmService.missAction(`Trình duyệt giá này chưa được xem xét bởi TN. Dự thầu và TP.Dự thầu`, null);
    } else {
      const that = this;
      if (this.model.isDraftVersion) {
        this.alertService.error('Chưa đủ bản chính thức!');
        return null;
      }
      this.confirmService.confirm('Bạn có chắc muốn gửi duyệt trình duyệt giá?', () => {
        this.priceReviewService.guiDuyetTrinhDuyetGia(this.packageId).subscribe(data => {
          that.getDataDefaultMapping();
          this.isShowSendApprovalTime = true;
          this.refresh();
          that.alertService.success('Gửi duyệt trình duyệt giá thành công!');
        }, err => {
          that.alertService.error('Gửi duyệt trình duyệt giá thất bại, vui lòng thử lại sau!');
        });
      });
    }
  }

  guiDuyetLai() {
    const dieuKienGuiDuyet = (this.priceReviewForm.get('isApprovedByTenderLeader').value !== null &&
      this.priceReviewForm.get('isApprovedByTenderManager').value !== null);
    if ((this.model.isApprovedByTenderLeader == null || this.model.isApprovedByTenderManager == null) && !dieuKienGuiDuyet) {
      this.confirmService.missAction(`Trình duyệt giá này chưa được xem xét bởi TN. Dự thầu và TP.Dự thầu`, null);
    } else {
      const that = this;
      if (this.model.isDraftVersion) {
        this.alertService.error('Chưa đủ bản chính thức!');
        return null;
      }
      this.confirmService.confirm('Bạn có chắc muốn gửi duyệt lại trình duyệt giá?', () => {
        this.priceReviewService.guiDuyetLaiTrinhDuyetGia(this.packageId).subscribe(data => {
          that.getDataDefaultMapping();
          that.refresh();
          that.alertService.success('Gửi duyệt lại trình duyệt giá thành công!');
        }, err => {
          that.alertService.error('Gửi duyệt lại trình duyệt giá thất bại, vui lòng thử lại sau!');
        });
      });
    }
  }

  // RQ - Count /GFA Value = AmountValue/GFA
  countGeneralExpensesBaseGfa(event) {
    const value = (event.target.value) / +this.priceReviewForm.get('infoGfa').value;
    if (Number(value.toFixed(2)) >= 0.01) {
      this.priceReviewForm.get('chiPhiBaseGfa').patchValue(Number(value.toFixed(2)));
    } else {
      this.priceReviewForm.get('chiPhiBaseGfa').patchValue(0);
    }
    this.countTotalCostOfCapitalBaseTenderAmount();
  }
  countDirectConstructionBaseGfa(event) {
    const value = (event.target.value) / +this.priceReviewForm.get('infoGfa').value;
    if (Number(value.toFixed(2)) >= 0.01) {
      this.priceReviewForm.get('giaTriBaseGfa').patchValue(Number(value.toFixed(2)));
    } else {
      this.priceReviewForm.get('giaTriBaseGfa').patchValue(0);
    }
    this.countTotalCostOfCapitalBaseTenderAmount();
  }
  countNSCBaseGfa(event) {
    const value = (event.target.value) / +this.priceReviewForm.get('infoGfa').value;
    if (Number(value.toFixed(2)) >= 0.01) {
      this.priceReviewForm.get('giaTriPCBaseGfa').patchValue(Number(value.toFixed(2)));
    } else {
      this.priceReviewForm.get('giaTriPCBaseGfa').patchValue(0);
    }
    this.countTotalCostOfCapitalBaseTenderAmount();
  }
  countDirectContractorBaseGfa(event) {
    const value = (event.target.value) / +this.priceReviewForm.get('infoGfa').value;
    if (Number(value.toFixed(2)) >= 0.01) {
      this.priceReviewForm.get('giaTriNhaThauTrucTiepBaseGfa').patchValue(Number(value.toFixed(2)));
    } else {
      this.priceReviewForm.get('giaTriNhaThauTrucTiepBaseGfa').patchValue(0);
    }
    this.countTotalCostOfCapitalBaseTenderAmount();
  }



  countGeneralExpensesAlterGfa(event) {
    const value = (event.target.value) / +this.priceReviewForm.get('infoGfa').value;
    if (Number(value.toFixed(2)) >= 0.01) {
      this.priceReviewForm.get('chiPhiAlterGfa').patchValue(Number(value.toFixed(2)));
    } else {
      this.priceReviewForm.get('chiPhiAlterGfa').patchValue(0);
    }
    this.countTotalCostOfCapitalAlterTenderAmount();
  }

  countDirectConstructionAlterGfa(event) {
    const value = (event.target.value) / +this.priceReviewForm.get('infoGfa').value;
    if (Number(value.toFixed(2)) >= 0.01) {
      this.priceReviewForm.get('giaTriAlterGfa').patchValue(Number(value.toFixed(2)));
    } else {
      this.priceReviewForm.get('giaTriAlterGfa').patchValue(0);
    }
    this.countTotalCostOfCapitalAlterTenderAmount();
  }

  countNSCAlterGfa(event) {
    const value = (event.target.value) / +this.priceReviewForm.get('infoGfa').value;
    if (Number(value.toFixed(2)) >= 0.01) {
      this.priceReviewForm.get('giaTriPCAlterGfa').patchValue(Number(value.toFixed(2)));
    } else {
      this.priceReviewForm.get('giaTriPCAlterGfa').patchValue(0);
    }
    this.countTotalCostOfCapitalAlterTenderAmount();
  }

  countDirectContractorAlterGfa(event) {
    const value = (event.target.value) / +this.priceReviewForm.get('infoGfa').value;
    if (Number(value.toFixed(2)) >= 0.01) {
      this.priceReviewForm.get('giaTriNhaThauTrucTiepAlterGfa').patchValue(Number(value.toFixed(2)));
    } else {
      this.priceReviewForm.get('giaTriNhaThauTrucTiepAlterGfa').patchValue(0);
    }
    this.countTotalCostOfCapitalAlterTenderAmount();
  }

  countTotalCostOfCapitalBaseTenderAmount() {
    const valueGeneralExpensesAmount = this.priceReviewForm.get('chiPhiBaseAmount').value ?
      this.priceReviewForm.get('chiPhiBaseAmount').value : 0;
    const valueDirectConstructionAmount = this.priceReviewForm.get('giaTriBaseAmount').value ?
      this.priceReviewForm.get('giaTriBaseAmount').value : 0;
    const valueNSCAmount = this.priceReviewForm.get('giaTriPCBaseAmount').value ?
      this.priceReviewForm.get('giaTriPCBaseAmount').value : 0;
    const valueDirectContractorAmount = this.priceReviewForm.get('giaTriNhaThauTrucTiepBaseAmount').value ?
      this.priceReviewForm.get('giaTriNhaThauTrucTiepBaseAmount').value : 0;
    const totalValue = +valueGeneralExpensesAmount + +valueDirectConstructionAmount + +valueNSCAmount + +valueDirectContractorAmount;
    if (Number(totalValue.toFixed(2)) >= 0.01) {
      this.priceReviewForm.get('totalGiaVonAmount').patchValue(Number(totalValue.toFixed(2)));
    } else {
      this.priceReviewForm.get('totalGiaVonAmount').patchValue(0);
    }
    // Count /GFA
    const totalBaseTenderGfa = totalValue / +this.priceReviewForm.get('infoGfa').value;
    if (Number(totalBaseTenderGfa.toFixed(2)) >= 0.01) {
      this.priceReviewForm.get('totalGiaVonGfa').patchValue(Number(totalBaseTenderGfa.toFixed(2)));
    } else {
      this.priceReviewForm.get('totalGiaVonGfa').patchValue(Number(totalBaseTenderGfa.toFixed(2)));
    }
    // Count Total Bid Price
    this.countTotalBidPriceBaseTender();

    if (this.priceReviewForm.get('infoGfa').value === null) {
      this.alertService.error('Vui lòng kiểm tra lại diện tích sàn tại thông tin chi tiết gói thầu để dữ liệu của trình duyệt giá được đảm bảo');
    }
  }
  countTotalCostOfCapitalAlterTenderAmount() {
    const valueGeneralExpensesAmount = this.priceReviewForm.get('chiPhiAlterAmount').value ?
      this.priceReviewForm.get('chiPhiAlterAmount').value : 0;
    const valueDirectConstructionAmount = this.priceReviewForm.get('giaTriAlterAmount').value ?
      this.priceReviewForm.get('giaTriAlterAmount').value : 0;
    const valueNSCAmount = this.priceReviewForm.get('giaTriPCAlterAmount').value ?
      this.priceReviewForm.get('giaTriPCAlterAmount').value : 0;
    const valueDirectContractorAmount = this.priceReviewForm.get('giaTriNhaThauTrucTiepAlterAmount').value ?
      this.priceReviewForm.get('giaTriNhaThauTrucTiepAlterAmount').value : 0;
    const totalValue = +valueGeneralExpensesAmount + +valueDirectConstructionAmount + +valueNSCAmount + +valueDirectContractorAmount;
    if (Number(totalValue.toFixed(2)) >= 0.01) {
      this.priceReviewForm.get('totalAlterAmount').patchValue(Number(totalValue.toFixed(2)));
    } else {
      this.priceReviewForm.get('totalAlterAmount').patchValue(0);
    }
    // Count /GFA
    const totalAlterTenderGfa = totalValue / +this.priceReviewForm.get('infoGfa').value;
    if (Number(totalAlterTenderGfa.toFixed(2)) >= 0.01) {
      this.priceReviewForm.get('totalAlterGfa').patchValue(Number(totalAlterTenderGfa.toFixed(2)));
    } else {
      this.priceReviewForm.get('totalAlterGfa').patchValue(0);
    }
    // Count Total Bid Price
    this.countTotalBidPriceAlterTender();
  }
  countTotalBidPriceBaseTender() {
    const value = (this.priceReviewForm.get('totalGiaVonAmount').value ? +this.priceReviewForm.get('totalGiaVonAmount').value : 0) +
      (this.priceReviewForm.get('chiPhiLoiNhuanAmountGfa').value ? +this.priceReviewForm.get('chiPhiLoiNhuanAmountGfa').value : 0);
    if (Number(value.toFixed(2)) >= 0.01) {
      this.priceReviewForm.get('giaDiNopThauAmount').patchValue(Number(value.toFixed(2)));
    } else {
      this.priceReviewForm.get('giaDiNopThauAmount').patchValue(0);
    }
    this.countRateONPbaseTender();
  }
  countTotalBidPriceAlterTender() {
    const value = (this.priceReviewForm.get('totalAlterAmount').value ? +this.priceReviewForm.get('totalAlterAmount').value : 0) +
      (this.priceReviewForm.get('chiPhiLoiNhuanAlterAmountGfa').value ?
        +this.priceReviewForm.get('chiPhiLoiNhuanAlterAmountGfa').value : 0);
    if (Number(value.toFixed(2)) >= 0.01) {
      this.priceReviewForm.get('giaDiNopThauAlterAmount').patchValue(Number(value.toFixed(2)));
    } else {
      this.priceReviewForm.get('giaDiNopThauAlterAmount').patchValue(0);
    }
    this.countRateONPalterTender();
  }
  countRateONPbaseTender() {
    const value = (this.priceReviewForm.get('chiPhiLoiNhuanAmountGfa').value ?
      +this.priceReviewForm.get('chiPhiLoiNhuanAmountGfa').value : 0) / Number(this.priceReviewForm.get('giaDiNopThauAmount').value) * 100;
    if (Number(value.toFixed(2)) >= 0.01) {
      this.priceReviewForm.get('tyleAmount').patchValue(Number(value.toFixed(2)));
    } else {
      this.priceReviewForm.get('tyleAmount').patchValue(0);
    }
  }
  countRateONPalterTender() {
    const value = (this.priceReviewForm.get('chiPhiLoiNhuanAlterAmountGfa').value ?
      +this.priceReviewForm.get('chiPhiLoiNhuanAlterAmountGfa').value : 0) /
      Number(this.priceReviewForm.get('giaDiNopThauAlterAmount').value) * 100;
    if (Number(value.toFixed(2)) >= 0.01) {
      this.priceReviewForm.get('tyleAlter').patchValue(Number(value.toFixed(2)));
    } else {
      this.priceReviewForm.get('tyleAlter').patchValue(0);
    }
  }
}
