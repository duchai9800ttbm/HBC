import { Component, OnInit } from '@angular/core';
import { Traffic } from '../../../../../../../../shared/models/site-survey-report/traffic.model';

@Component({
  selector: 'app-traffic',
  templateUrl: './traffic.component.html',
  styleUrls: ['./traffic.component.scss']
})
export class TrafficComponent implements OnInit {
  disadvantageImageUrls = [];
  advantageImageUrls = [];
  directionImageUrls = [];
  existingImageUrls = [];
  roadImageUrls = [];
  fenceImageUrls = [];
  url;
  trafficModel: Traffic;
  constructor() { }

  ngOnInit() {
    this.trafficModel = new Traffic();
    this.trafficModel = {
      chiTietDiaHinh: {
        khoKhan: {
          description: 'Text',
          images: [
            {
              id: '123',
              image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
            }
          ]
        },
        thuanLoi: {
          description: 'Text',
          images: [
            {
              id: '',
              image: ''
            }
          ]
        }
      },
      loiVaoCongTrinh: {
        huongVao: {
          description: 'Text',
          images: [
            {
              id: '123',
              image: ''
            }
          ]
        },
        duongHienCo: {
          description: 'Text',
          images: [
            {
              id: '',
              image: ''
            }
          ]
        },
        yeuCauDuongTam: {
          description: 'Text',
          images: [
            {
              id: '',
              image: ''
            }
          ]
        },
        yeuCauHangRao: {
          description: 'Text',
          images: [
          ]
        }
      }
    };
  }
  uploaDisadvantageImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.disadvantageImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteDisadvantageImage() {
    const index = this.disadvantageImageUrls.indexOf(this.url);
    this.disadvantageImageUrls.splice(index, 1);
  }

  uploaAdvantageImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.advantageImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteAdvantageImage() {
    const index = this.advantageImageUrls.indexOf(this.url);
    this.advantageImageUrls.splice(index, 1);
  }

  uploadDirectionImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.directionImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteDirectionImage() {
    const index = this.directionImageUrls.indexOf(this.url);
    this.directionImageUrls.splice(index, 1);
  }

  uploadExistingImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.existingImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteExistingImage() {
    const index = this.existingImageUrls.indexOf(this.url);
    this.existingImageUrls.splice(index, 1);
  }

  uploadRoadImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.roadImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteRoadImage() {
    const index = this.roadImageUrls.indexOf(this.url);
    this.roadImageUrls.splice(index, 1);
  }

  uploadFenceImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.fenceImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteFenceImage() {
    const index = this.fenceImageUrls.indexOf(this.url);
    this.fenceImageUrls.splice(index, 1);
  }
}
