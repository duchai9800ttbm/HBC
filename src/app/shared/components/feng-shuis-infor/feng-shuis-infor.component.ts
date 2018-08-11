import { Component, OnInit, Input } from '@angular/core';
import { FengShuisInforService } from '../../services/feng-shuis-infor.service';

@Component({
  selector: 'app-feng-shuis-infor',
  templateUrl: './feng-shuis-infor.component.html',
  styleUrls: ['./feng-shuis-infor.component.scss']
})
export class FengShuisInforComponent implements OnInit {
  @Input() gender = 'male';
  @Input() lunarBirthday = 'Bính ngọ';
  constructor(
    private fengShuisInforService: FengShuisInforService
  ) { }
  fengShuisInforModel;
  ngOnInit() {
    this.fengShuisInforService.getFengShuisInfo(this.lunarBirthday, this.gender).subscribe(result => {
      this.fengShuisInforModel = result;
      console.log(result);
    });
  }

}
