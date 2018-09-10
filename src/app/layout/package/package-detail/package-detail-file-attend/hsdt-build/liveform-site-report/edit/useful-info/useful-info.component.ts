import { Component, OnInit } from '@angular/core';
import { AlertService, ConfirmationService } from '../../../../../../../../shared/services';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { UsefulInfo } from '../../../../../../../../shared/models/site-survey-report/useful-info.model';

@Component({
  selector: 'app-useful-info',
  templateUrl: './useful-info.component.html',
  styleUrls: ['./useful-info.component.scss']
})
export class UsefulInfoComponent implements OnInit {
  usefulInfoForm: FormGroup;
  topicLists = [];
  url;
  usefulFakeData: UsefulInfo;
  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.usefulInfoForm = this.fb.group({
      topic: this.fb.array([])
    });
    this.usefulFakeData = {
      chuDe: 'Test',
      noiDung: 'test',
      moTa: 'Test',
      image: {
        description: null,
        images: []
      }
    };
  }
  addTopic(name: string, data?: UsefulInfo) {
    const formArray = this.usefulInfoForm.get(name) as FormArray;
    const formItem = this.fb.group({
      chuDe: data ? data.chuDe : '',
      noiDung: data ? data.noiDung : '',
      moTa: data ? data.moTa : '',
      image: data ? data.image : []
    });
    formArray.push(formItem);
    console.log(formArray);
  }
  addContent() {

  }
  deleteTopic(name: string, idx: number) {
    const formArray = this.usefulInfoForm.get(name) as FormArray;
    formArray.removeAt(idx);
    console.log('ok');
  }
  uploadContentImage() {
  }

}
  // uploaContentImage(event, i) {
  //   const files = event.target.files;
  //   const index = i;
  //   if (files) {
  //     for (const file of files) {
  //       const reader = new FileReader();
  //       reader.onload = (e: any) => this.topicLists[index].push(e.target.result);
  //       reader.readAsDataURL(file);
  //     }
  //   }
  // }
  // deleteContentImage() {
  //   const index = this.topicLists.indexOf(this.url);
  //   this.topicLists.splice(index, 1);
  // }

  // addTopic() {
  //   const max = this.topicLists.length;
  //   this.topicLists.push([]);
  //   console.log(this.topicLists);
  // }
  // deleteTopic(topic) {
  //   const that = this;
  //   const index = this.topicLists.indexOf(topic);
  //   this.confirmationService.confirm('Bạn có chắc chắn muốn xóa chủ đề này?',
  //     () => {
  //       that.topicLists.splice(index, 1);
  //       that.alertService.success('Đã xóa chủ đề!', true);
  //     });
  // }

// }
