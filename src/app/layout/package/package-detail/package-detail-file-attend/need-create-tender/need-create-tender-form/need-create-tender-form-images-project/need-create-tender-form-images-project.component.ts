import { Component, OnInit } from '@angular/core';
import { PackageService } from '../../../../../../../shared/services/package.service';
import { AlertService } from '../../../../../../../shared/services';
import { PackageDetailComponent } from '../../../../package-detail.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-need-create-tender-form-images-project',
  templateUrl: './need-create-tender-form-images-project.component.html',
  styleUrls: ['./need-create-tender-form-images-project.component.scss']
})
export class NeedCreateTenderFormImagesProjectComponent implements OnInit {
  routerAction: string;
  imageProjects = [];
  showPopupViewImage = false;
  indexOfImage: number;
  imageUrlArray = [];
  constructor(
    private packageService: PackageService,
    private alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
    this.routerAction = this.packageService.routerAction;
    this.packageService.routerAction$.subscribe(router => {
      this.routerAction = router;
    });
  }
  uploadImageProject(event) {
    const files = event.target.files;
    this.packageService.uploadImageService(files).subscribe(imageUrls => {
      this.imageProjects = [...this.imageProjects, ...imageUrls];
    });
  }
  deleteImage(i) {
    const index = this.imageProjects.indexOf(i);
    if (i.guid) {
      this.packageService.deleteImageService(i.guid).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.imageProjects.splice(index, 1);
  }
  viewFullScreenImage(listImage, indexImage?) {
    this.showPopupViewImage = true;
    this.imageUrlArray = [...listImage];
    this.indexOfImage = indexImage;
  }
  closeView() {
    this.showPopupViewImage = false;
  }
  routerLink(event, link) {
    if (event.key === 'Enter') {
      this.router.navigate([`/package/detail/${+PackageDetailComponent.packageId}/attend/create-request/form/create/${link}`]);
    }
  }

}
