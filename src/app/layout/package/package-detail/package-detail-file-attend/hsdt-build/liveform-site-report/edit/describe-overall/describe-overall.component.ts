import { Component, OnInit } from '@angular/core';
import { DescribeOverall } from '../../../../../../../../shared/models/site-survey-report/describe-overall.model';

@Component({
  selector: 'app-describe-overall',
  templateUrl: './describe-overall.component.html',
  styleUrls: ['./describe-overall.component.scss']
})
export class DescribeOverallComponent implements OnInit {
  topographyImageUrls = [];
  existingBuildImageUrls = [];
  stacaleImageUrls = [];
  url;
  describeModel: DescribeOverall;
  constructor() { }

  ngOnInit() {
    this.describeModel = new DescribeOverall();
    this.describeModel = {
      chiTietDiaHinh: {
        description: 'XEM FILE ĐÍNH KÈM',
        images: [
          {
            id: '011',
            image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
          }
        ]
      },
      kienTrucHienHuu: {
        description: 'Không có. Chưa có rào tạm',
        images: [
          {
            id: '031',
            image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
          }
        ]
      },
      yeuCauChuongNgai: {
        description: 'Không có',
        images: [
          {
            id: '001',
            image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
          }
        ]
      }
    };
  }
  uploadTopographyImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.topographyImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteTopographyImage() {
    const index = this.topographyImageUrls.indexOf(this.url);
    this.topographyImageUrls.splice(index, 1);
  }

  uploadExistingBuildImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.existingBuildImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteExistingBuildImage() {
    const index = this.existingBuildImageUrls.indexOf(this.url);
    this.existingBuildImageUrls.splice(index, 1);
  }

  uploadStacaleImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.stacaleImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteStacaleImage() {
    const index = this.stacaleImageUrls.indexOf(this.url);
    this.stacaleImageUrls.splice(index, 1);
  }


}
