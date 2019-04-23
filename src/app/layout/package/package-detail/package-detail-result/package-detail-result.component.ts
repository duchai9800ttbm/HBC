import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PackageService } from '../../../../shared/services/package.service';
import { slideToTop } from '../../../../router.animations';
import { PackageDetailComponent } from '../package-detail.component';
import { CheckStatusPackage } from '../../../../shared/constants/check-status-package';
import { Subscription } from '../../../../../../node_modules/rxjs';

@Component({
    selector: 'app-package-detail-result',
    templateUrl: './package-detail-result.component.html',
    styleUrls: ['./package-detail-result.component.scss'],
    animations: [slideToTop()]
})
export class PackageDetailResultComponent implements OnInit, OnDestroy {
    public packageId;
    checkStatusPackage = CheckStatusPackage;
    subscription: Subscription;
    constructor(
        private activatedRoute: ActivatedRoute,
        private packageService: PackageService,
        private router: Router,
        private activeRouter: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.packageId = +PackageDetailComponent.packageId;
        this.subscription = this.packageService.directionalTabResult.subscribe(value => {
            this.getInforPackageID(); // Điều hướng
        });
        this.getInforPackageID(); // Điều hướng
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getInforPackageID() {
        this.packageService.getInforPackageID(this.packageId).subscribe(result => {
            this.packageService.statusPackageValue2 = this.checkStatusPackage[result.stageStatus.id];
            this.packageService.changeStatusPackageValue(result.stageStatus.id);
            if (result.isSendMailKickOff) {
                this.router.navigate([`/package/detail/${this.packageId}/result/package-success/meeting-kickoff`]);
            } else if (result.isSignedContract) {
                this.router.navigate([`/package/detail/${this.packageId}/result/package-success/contract-signed`]);
            } else {
                switch (this.checkStatusPackage[result.stageStatus.id].id) {
                    case (this.checkStatusPackage.ChoKetQuaDuThau.id): {
                        this.router.navigate([`/package/detail/${this.packageId}/result/wait-result`]);
                        break;
                    }
                    // case (this.checkStatusPackage.ChoKetQuaDuThau.id):
                    case (this.checkStatusPackage.TrungThau.id):
                    case (this.checkStatusPackage.DaPhanHoiDenPhongHopDong.id):
                    case (this.checkStatusPackage.DaThongBaoCacBenLienQuan.id):
                    case (this.checkStatusPackage.DaChuyenGiaoTaiLieu.id):
                    case (this.checkStatusPackage.ChuaNhanTaiLieu.id):
                    case (this.checkStatusPackage.ChuaChuyenGiaoTaiLieu.id):
                    case (this.checkStatusPackage.DaNhanTaiLieu.id): {
                        this.router.navigate([`/package/detail/${this.packageId}/result/package-success/package-list`]);
                        break;
                    }
                    // case (this.checkStatusPackage.DaKyKetHopDong.id): {
                    //     this.router.navigate([`/package/detail/${this.packageId}/result/package-success/contract-signed`]);
                    //     break;
                    // }
                    // case (this.checkStatusPackage.DaThongBaoHopKickOff.id):
                    // case (this.checkStatusPackage.DaNhanTaiLieu.id): {
                    //     this.router.navigate([`/package/detail/${this.packageId}/result/package-success/meeting-kickoff`]);
                    //     break;
                    // }
                    case (this.checkStatusPackage.TratThau.id): {
                        this.router.navigate([`/package/detail/${this.packageId}/result/package-failed`]);
                        break;
                    }
                    case (this.checkStatusPackage.HuyThau.id): {
                        this.router.navigate([`/package/detail/${this.packageId}/result/package-cancel`]);
                        break;
                    }
                }
            }
        });
    }

}
