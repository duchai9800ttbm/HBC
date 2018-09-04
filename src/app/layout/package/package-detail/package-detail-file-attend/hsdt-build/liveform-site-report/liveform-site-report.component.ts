import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-liveform-site-report',
  templateUrl: './liveform-site-report.component.html',
  styleUrls: ['./liveform-site-report.component.scss']
})
export class LiveformSiteReportComponent implements OnInit {
  isData;
  fakeData = [
    {
      id: 3,
      stt: 1,
      ttl: 'Báo cáo khảo sát công trường',
      lpv: 1,
      maker: 'Oliver Dang',
      date: '15/12/2017, 09:00',
      classify: 'MEP',
      classifyType: 'Nâng cấp, cải tiến (Renovation)',
      area: 12334234,
      totalBuild: 99999,
      numberOfFloor: 40,
      progress: 250,
      updateTimes: 2,
      updater: 'Oliver Dang',
      updateDate: '15/12/2017, 09:00',
      updateContent: 'Chọn lại loại công trình, thêm ảnh',
      updateDetail: 'Loại công trình mới'
    },
    {
      id: 4,
      stt: 2,
      ttl: 'Báo cáo khảo sát công trường',
      lpv: 1,
      maker: 'Oliver Dang',
      date: '15/12/2017, 09:00',
      classify: 'Sân bay',
      classifyType: 'Mới (New)',
      area: 12334234,
      totalBuild: 8888,
      numberOfFloor: 35,
      progress: 550,
      updateTimes: 1,
      updater: 'Oliver Dang',
      updateDate: '15/11/2017, 07:00',
      updateContent: 'Chọn lại loại công trình, thêm ảnh',
      updateDetail: 'Loại công trình mới'
    }
  ];

  constructor() { }

  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    const elem = Array.from(document.querySelectorAll('#searchButton, #agreeButton, #addNewButton, #printButton, #deleteButton, #downloadButton'));
    console.log(elem);
    elem.forEach(e => { (<HTMLElement>e).style.visibility = 'hidden'; (<HTMLElement>e).style.position = 'absolute'; });
    (this.fakeData.length) ? this.isData = true : this.isData = false;
  }

}
