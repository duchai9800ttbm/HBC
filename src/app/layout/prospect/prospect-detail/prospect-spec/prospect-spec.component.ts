import { routerTransition } from '../../../../router.animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProspectService, CampaignService } from '../../../../shared/services';
import { ParamMap } from '@angular/router';
import { Observable } from "rxjs/Observable";
import { ProspectModel } from '../../../../shared/models/index';
import { FengShuisInforService } from '../../../../shared/services/feng-shuis-infor.service';
import { DialogService } from '../../../../../../node_modules/@progress/kendo-angular-dialog';
import { FengShuisInforComponent } from '../../../../shared/components/feng-shuis-infor/feng-shuis-infor.component';

@Component({
  selector: 'app-prospect-spec',
  templateUrl: './prospect-spec.component.html',
  styleUrls: ['./prospect-spec.component.scss'],
  animations: [routerTransition()]
})
export class ProspectSpecComponent implements OnInit {
  prospect$: Observable<ProspectModel>;
  isCollapsedMain = false;
  isCollapsedAddress = false;
  isCollapsedDesc = false;
  fengShuisInforModel;
  campaign;
  gender;
  lunarBirthday;
  public dialog;

  constructor(
    private route: ActivatedRoute,
    private prospectService: ProspectService,
    private fengShuisInforService: FengShuisInforService,
    private campaignService: CampaignService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.prospect$ = this.route.parent.paramMap.switchMap((params: ParamMap) =>
      this.prospectService.view(params.get('id')));
    this.prospect$.subscribe(result => {
      this.gender = result.gender;
      this.lunarBirthday = result.lunarBirthday;
      if (result.lunarBirthday && result.gender) {
        this.fengShuisInforService.getFengShuisInfo(result.lunarBirthday, result.gender).subscribe(res => {
          this.fengShuisInforModel = res;
        });
      }
      if (result && result.id && result.objectId) {
        this.campaignService.view(result.objectId).subscribe(res => {
          this.campaign = {
            id: res.id,
            text: res.name
          };
        });
      }
    });
  }

  public showDialog() {
    this.dialog = this.dialogService.open({
      title: 'PHONG THỦY',
      content: FengShuisInforComponent,
      width: 750,
      height: 540,
      minWidth: 250,
    });
    const model = this.dialog.content.instance;
    model.gender = this.gender;
    model.lunarBirthday = this.lunarBirthday;
  }

}
