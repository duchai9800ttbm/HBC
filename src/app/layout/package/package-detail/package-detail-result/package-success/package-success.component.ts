import { Component, OnInit,Input,Output ,EventEmitter} from '@angular/core';
import { PackageService } from '../../../../../shared/services/package.service';
import { PackageDetailComponent } from '../../package-detail.component';
@Component({
  selector: 'app-package-success',
  templateUrl: './package-success.component.html',
  styleUrls: ['./package-success.component.scss']
})
export class PackageSuccessComponent implements OnInit {
  packageId: number;
  isActive: boolean;
  constructor(private PackageService: PackageService) {
   
   }

  ngOnInit() {
    this.packageId = +PackageDetailComponent.packageId;
    this.isActive = false;
    this.PackageService.userId$.subscribe(result => {
    this.isActive = result
  });
  }

}
