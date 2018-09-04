import { Component, OnInit } from '@angular/core';
import { ConfirmationService, AlertService } from '../../../../../../../../shared/services';

@Component({
  selector: 'app-useful-info',
  templateUrl: './useful-info.component.html',
  styleUrls: ['./useful-info.component.scss']
})
export class UsefulInfoComponent implements OnInit {
  topicLists = [];

  contentImgs = [];
  content1Imgs = [];
  url;
  constructor(
    private confirmationService: ConfirmationService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
  }
  uploaContentImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.contentImgs.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteImg() {
    const index = this.contentImgs.indexOf(this.url);
    this.contentImgs.splice(index, 1);
  }

  addTopic() {
    const max = this.topicLists.length;
    this.topicLists.push(max + 1);
  }
  deleteTopic(topic) {
    const that = this;
    const index = this.topicLists.indexOf(topic);
    this.confirmationService.confirm('Bạn có chắc chắn muốn xóa chủ đề này?',
      () => {
        that.topicLists.splice(index, 1);
        that.alertService.success('Đã xóa chủ đề!', true);
      });
  }

}
