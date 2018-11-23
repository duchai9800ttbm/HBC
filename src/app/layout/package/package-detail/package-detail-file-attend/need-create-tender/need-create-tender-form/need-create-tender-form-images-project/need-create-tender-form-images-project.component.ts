import { Component, OnInit, ViewChild } from '@angular/core';
import { PackageService } from '../../../../../../../shared/services/package.service';
import { AlertService } from '../../../../../../../shared/services';
import { PackageDetailComponent } from '../../../../package-detail.component';
import { Router } from '@angular/router';
import { NeedCreateTenderFormComponent } from '../need-create-tender-form.component';

@Component({
  selector: 'app-need-create-tender-form-images-project',
  templateUrl: './need-create-tender-form-images-project.component.html',
  styleUrls: ['./need-create-tender-form-images-project.component.scss']
})
export class NeedCreateTenderFormImagesProjectComponent implements OnInit {
  @ViewChild('uploadImage') uploadImage;
  routerAction: string;
  imageProjects = [];
  showPopupViewImage = false;
  indexOfImage: number;
  imageUrlArray = [];
  bidOpportunityId: number;
  constructor(
    private packageService: PackageService,
    private alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
    this.bidOpportunityId = PackageDetailComponent.packageId;
    this.routerAction = this.packageService.routerAction;
    this.packageService.routerAction$.subscribe(router => {
      this.routerAction = router;
      this.loadData();
    });
  }
  loadData() {
    // tslint:disable-next-line:max-line-length
    if (NeedCreateTenderFormComponent.formModel && NeedCreateTenderFormComponent.formModel.projectImage && NeedCreateTenderFormComponent.formModel.projectImage.projectImages) {
      this.imageProjects = [...NeedCreateTenderFormComponent.formModel.projectImage.projectImages];
    }
  }
  uploadImageProject(event) {
    const files = event.target.files;
    this.packageService.uploadImagTender(files, this.bidOpportunityId).subscribe(imageUrls => {
      this.imageProjects = [...this.imageProjects, ...imageUrls];
      NeedCreateTenderFormComponent.formModel.projectImage.projectImages = this.imageProjects;
      this.uploadImage.nativeElement.value = null;
    });
  }
  deleteImage(i) {
    const index = this.imageProjects.indexOf(i);
    this.imageProjects.splice(index, 1);
    if (i.guid) {
      this.packageService.deleteImageTender(i.guid).subscribe(() => {
      });
    }
    NeedCreateTenderFormComponent.formModel.projectImage.projectImages = [...this.imageProjects];
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
