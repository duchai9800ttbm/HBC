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
  describeOverall: DescribeOverall;
  constructor() { }

  ngOnInit() {
    this.describeOverall = new DescribeOverall();
    this.describeOverall = {
      chiTietDiaHinh: {
        description: 'Demo miêu tả chi tiết địa hình',
        images: [
          {
            id: '011',
            // tslint:disable-next-line:max-line-length
            image: 'https://www.google.com.vn/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwicrOnAkqHdAhXNdH0KHfImD2oQjRx6BAgBEAU&url=http%3A%2F%2Fthuvienanhdep.net%2Fnhung-hinh-anh-hot-girl-cuc-xinh-va-dang-yeu-danh-lam-hinh-nen-dien-thoai%2F&psig=AOvVaw2ENc-rTTvHCOZxXX5RpcS7&ust=1536143466729323'
          }
        ]
      },
      kienTrucHienHuu: {
        description: 'Demo miêu tả kiến trúc hiện hữu',
        images: [
          {
            id: '031',
            // tslint:disable-next-line:max-line-length
            image: 'https://www.google.com.vn/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwicrOnAkqHdAhXNdH0KHfImD2oQjRx6BAgBEAU&url=http%3A%2F%2Fthuvienanhdep.net%2Fnhung-hinh-anh-hot-girl-cuc-xinh-va-dang-yeu-danh-lam-hinh-nen-dien-thoai%2F&psig=AOvVaw2ENc-rTTvHCOZxXX5RpcS7&ust=1536143466729323'
          }
        ]
      },
      yeuCauChuongNgai: {
        description: 'Demo miêu tả yêu cầu chướng ngại',
        images: [
          {
            id: '001',
            // tslint:disable-next-line:max-line-length
            image: 'https://www.google.com.vn/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwicrOnAkqHdAhXNdH0KHfImD2oQjRx6BAgBEAU&url=http%3A%2F%2Fthuvienanhdep.net%2Fnhung-hinh-anh-hot-girl-cuc-xinh-va-dang-yeu-danh-lam-hinh-nen-dien-thoai%2F&psig=AOvVaw2ENc-rTTvHCOZxXX5RpcS7&ust=1536143466729323'
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
