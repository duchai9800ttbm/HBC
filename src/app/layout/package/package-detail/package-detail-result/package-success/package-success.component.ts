import { Component, OnInit,Input,Output ,EventEmitter} from '@angular/core';
import { PackageService } from '../../../../../shared/services/package.service';
@Component({
  selector: 'app-package-success',
  templateUrl: './package-success.component.html',
  styleUrls: ['./package-success.component.scss']
})
export class PackageSuccessComponent implements OnInit {
  @Output() SendMail = new EventEmitter();
  isActive: boolean;
  constructor(private PackageService: PackageService) {
   
   }

  ngOnInit() {
    this.isActive = false;
    this.PackageService.userId$.subscribe(result => {
    this.isActive = result
  });
  }

}
