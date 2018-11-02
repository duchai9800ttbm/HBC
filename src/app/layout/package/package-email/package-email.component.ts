import { Component, OnInit, OnDestroy } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { EmailService } from '../../../shared/services/email.service';
import { EmailCategory } from '../../../shared/models/email/email-item.model';
import { ActivatedRoute, Router } from '../../../../../node_modules/@angular/router';
import { PackageService } from '../../../shared/services/package.service';
import { PermissionService } from '../../../shared/services/permission.service';
import { Subscription } from '../../../../../node_modules/rxjs';
import { AdminPermissions } from '../../../shared/data-admin/admin.permission';
import { IntervalObservable } from '../../../../../node_modules/rxjs/observable/IntervalObservable';
import { PermissionModel } from '../../../shared/models/permission/Permission.model';

@Component({
  selector: 'app-package-email',
  templateUrl: './package-email.component.html',
  styleUrls: ['./package-email.component.scss'],
  // animations: [routerTransition()]
})
export class PackageEmailComponent implements OnInit, OnDestroy {
  static packageId;
  public packageId: number;
  listEmailCategory: EmailCategory[];
  assign;
  deploy;
  giveUp;
  important;
  interview;
  kickOff;
  miss;
  transfer;
  trash;
  win;

  sub: Subscription;
  subInterval: Subscription;
  subUser: Subscription;
  subFirst: Subscription;


  subscription: Subscription;
  listPermission: Array<PermissionModel>;
  listPermissionScreen = [];
  listPermissionScreen2 = [];
  listPermissionScreenKQ = [];
  listPermissionScreenKQ2 = [];

  XemEmail = false;
  XemEmailTBPV = false;
  XemEmailPhanHoi = false;
  XemMailThongBaoTrungThau = false;
  XemMailChuyenGiao = false;
  XemDanhSachEmailDaGui = false;

  
  constructor(
    private emailService: EmailService,
    private activetedRoute: ActivatedRoute,
    private packageService: PackageService,
    private router: Router,
    private permissionService: PermissionService
  ) { }

  ngOnInit() {
    console.log('this.router-before', this.packageService.routerBeforeEmail);
    this.activetedRoute.params.subscribe(result => {
      this.packageId = +result.id;
      PackageEmailComponent.packageId = this.packageId;
      const that = this;
      this.subUser = this.permissionService.getUser().subscribe(data => {
        if (data && data.userGroup && data.userGroup.text === 'Admin') {
          console.log('admin đang login');
          const arrayPermission = AdminPermissions;
          this.permissionService.set(arrayPermission);
          if (this.subInterval) {
            this.subInterval.unsubscribe();
          }
          if (this.subFirst) {
            this.subInterval.unsubscribe();
          }
        } else {
          if (this.subInterval) {
            this.subInterval.unsubscribe();
          }
          if (this.subFirst) {
            this.subInterval.unsubscribe();
          }
          this.subFirst = this.permissionService.getListPermission(this.packageId).subscribe(listPermission => {
            this.permissionService.set(listPermission);
            this.subFirst.unsubscribe();
          });
          this.subInterval = IntervalObservable.create(1 * 10 * 1000).subscribe(_ => {
            this.sub = this.permissionService.getListPermission(this.packageId).subscribe(listPermission => {
              this.permissionService.set(listPermission);
              that.sub.unsubscribe();
            });
          });
        }
      });
    });

    this.subscription = this.permissionService.get().subscribe(data => {
      this.listPermission = data;
      const hsdt = this.listPermission.length &&
        this.listPermission.filter(x => x.bidOpportunityStage === 'HSDT')[0];
      if (!hsdt) {
        this.listPermissionScreen = [];
      }
      if (hsdt) {
        const screen = hsdt.userPermissionDetails.length
          && hsdt.userPermissionDetails.filter(y => y.permissionGroup.value === 'TrienKhaiVaPhanCongTienDo')[0];
        if (!screen) {
          this.listPermissionScreen = [];
          this.listPermissionScreen2 = [];
        }
        if (screen) {
          this.listPermissionScreen = screen.permissions.map(z => z.value);
        }

        const screen2 = hsdt.userPermissionDetails.length
          && hsdt.userPermissionDetails.filter(y => y.permissionGroup.value === 'QuanLyPhongVanThuongThao')[0];
        if (!screen2) {
          this.listPermissionScreen2 = [];
        }
        if (screen2) {
          this.listPermissionScreen2 = screen2.permissions.map(z => z.value);
        }
      }

      this.XemEmail = this.listPermissionScreen.includes('XemEmail');
      this.XemEmailTBPV = this.listPermissionScreen2.includes('XemEmailTBPV');



      const hsdt2 = this.listPermission.length &&
        this.listPermission.filter(x => x.bidOpportunityStage === 'KQDT')[0];
      if (!hsdt2) {
        this.listPermissionScreenKQ = [];
        this.listPermissionScreenKQ2 = [];

      }
      if (hsdt2) {
        const screenKQ = hsdt2.userPermissionDetails.length
          && hsdt2.userPermissionDetails.filter(y => y.permissionGroup.value === 'KetQuaDuThau')[0];
        if (!screenKQ) {
          this.listPermissionScreenKQ = [];
        }
        if (screenKQ) {
          this.listPermissionScreenKQ = screenKQ.permissions.map(z => z.value);
        }

        const screenKQ2 = hsdt2.userPermissionDetails.length
          && hsdt2.userPermissionDetails.filter(y => y.permissionGroup.value === 'HopKickOff')[0];
        if (!screenKQ2) {
          this.listPermissionScreenKQ2 = [];
        }
        if (screenKQ2) {
          this.listPermissionScreenKQ2 = screenKQ2.permissions.map(z => z.value);
        }
      }

      this.XemEmailPhanHoi = this.listPermissionScreenKQ.includes('XemEmailPhanHoi');
      this.XemMailThongBaoTrungThau = this.listPermissionScreenKQ.includes('XemMailThongBaoTrungThau');
      this.XemMailChuyenGiao = this.listPermissionScreenKQ.includes('XemMailChuyenGiao');
      this.XemDanhSachEmailDaGui = this.listPermissionScreenKQ2.includes('XemDanhSachEmailDaGui');

    });
    this.emailService.watchEmailSubject().subscribe(data => {
      this.emailService.getListCategory(this.packageId).subscribe(result => {
        this.listEmailCategory = result;
        this.listEmailCategory.forEach(e => {
          if (e.category && e.category.key === 'RejectOpportunity') {
            this.giveUp = e;
          }
          if (e.category && e.category.key === 'PlanningAssignment') {
            this.assign = e;
          }
          if (e.category && e.category.key === 'TransferDocuments') {
            this.transfer = e;
          }
          if (e.category && e.category.key === 'AnnounceDeployment') {
            this.deploy = e;
          }
          if (e.category && e.category.key === 'AnnounceInterview') {
            this.interview = e;
          }
          if (e.category && e.category.key === 'AnnouncePassBidOpportunity') {
            this.win = e;
          }
          if (e.category && e.category.key === 'AnnounceFailBidOpportunity') {
            this.miss = e;
          }
          if (e.category && e.category.key === 'Kick-off') {
            this.kickOff = e;
          }
          if (e.category && e.category.key === 'TrashCan') {
            this.trash = e;
          }
          if (e.category && e.category.key === 'ImportantEmails') {
            this.important = e;
          }
        });
      });
    });
    this.emailService.getListCategory(this.packageId).subscribe(result => {
      this.listEmailCategory = result;
      this.listEmailCategory.forEach(e => {
        if (e.category && e.category.key === 'RejectOpportunity') {
          this.giveUp = e;
        }
        if (e.category && e.category.key === 'PlanningAssignment') {
          this.assign = e;
        }
        if (e.category && e.category.key === 'TransferDocuments') {
          this.transfer = e;
        }
        if (e.category && e.category.key === 'AnnounceDeployment') {
          this.deploy = e;
        }
        if (e.category && e.category.key === 'AnnounceInterview') {
          this.interview = e;
        }
        if (e.category && e.category.key === 'AnnouncePassBidOpportunity') {
          this.win = e;
        }
        if (e.category && e.category.key === 'AnnounceFailBidOpportunity') {
          this.miss = e;
        }
        if (e.category && e.category.key === 'Kick-off') {
          this.kickOff = e;
        }
        if (e.category && e.category.key === 'TrashCan') {
          this.trash = e;
        }
        if (e.category && e.category.key === 'ImportantEmails') {
          this.important = e;
        }
      });
    });
  }

  ngOnDestroy(): void {
    if (this.subInterval) {
      this.subInterval.unsubscribe();
    }
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.subUser) {
      this.subUser.unsubscribe();
    }
    if (this.subFirst) {
      this.subInterval.unsubscribe();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  backRouter() {
    if (this.packageService.routerBeforeEmail) {
      this.router.navigate([this.packageService.routerBeforeEmail]);
    } else {
      this.router.navigate([`/package/detail/${this.packageId}/info/infomation`]);
    }
  }

}
