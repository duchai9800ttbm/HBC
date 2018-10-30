import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PackageService } from '../../../../shared/services/package.service';
import { slideToTop } from '../../../../router.animations';
import { PackageDetailComponent } from '../package-detail.component';
import { CheckStatusPackage } from '../../../../shared/constants/check-status-package';

@Component({
    selector: 'app-package-detail-result',
    templateUrl: './package-detail-result.component.html',
    styleUrls: ['./package-detail-result.component.scss'],
    animations: [slideToTop()]
})
export class PackageDetailResultComponent implements OnInit {
    public packageId;
    checkStatusPackage = CheckStatusPackage;
    constructor(
        private activatedRoute: ActivatedRoute,
        private packageService: PackageService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.packageId = +PackageDetailComponent.packageId;
        this.getInforPackageID(); // Điều hướng
        this.activatedRoute.params.subscribe(result => {
            console.log('channge-params');
            // this.packageId = +result.id;
            console.log('channge-params', this.packageId);
        });
        this.packageService.statusPackageValue$.subscribe(status => {
            console.log('this.s-tatusPackage', status);
        });
    }

    getInforPackageID() {
        this.packageService.getInforPackageID(this.packageId).subscribe(result => {
            this.packageService.changeStatusPackageValue(result.stageStatus.id);
            switch (this.checkStatusPackage[result.stageStatus.id].id) {
                case (this.checkStatusPackage.ChoKetQuaDuThau.id): {
                    //
                    break;
                }
                case (this.checkStatusPackage.TrungThau.id):
                case (this.checkStatusPackage.DaPhanHoiDenPHopDong.id):
                case (this.checkStatusPackage.DaThongBaoCacBenLienQuan.id):
                case (this.checkStatusPackage.DaChuyenGiaoTaiLieu.id):
                case (this.checkStatusPackage.ChuaNhanTaiLieu.id):
                case (this.checkStatusPackage.DaNhanTaiLieu.id):
                case (this.checkStatusPackage.ChuaChuyenGiaoTaiLieu.id): {
                    this.router.navigate([`/package/detail/${this.packageId}/result/package-success/package-list`]);
                    break;
                }
                case (this.checkStatusPackage.DaKyKetHopDong.id): {
                    this.router.navigate([`/package/detail/${this.packageId}/result/package-success/contract-signed`]);
                    break;
                }
                case (this.checkStatusPackage.DaThongBaoHopKickOff.id): {
                    this.router.navigate([`/package/detail/${this.packageId}/result/package-success/meeting-kickoff`]);
                    break;
                }
                case (this.checkStatusPackage.TratThau.id): {
                    this.router.navigate([`/package/detail/${this.packageId}/result/package-failed`]);
                    break;
                }
                case (this.checkStatusPackage.HuyThau.id): {
                    this.router.navigate([`/package/detail/${this.packageId}/result/package-cancel`]);
                    break;
                }
            }
        });
    }

}
