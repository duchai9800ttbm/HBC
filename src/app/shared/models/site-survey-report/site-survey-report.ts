import { ScaleOverall } from './scale-overall.model';
import { DescribeOverall } from './describe-overall.model';
import { Traffic } from './traffic.model';
import { DemoConso } from './demo-conso.model';
import { ServiceConstruction } from './service-construction.model';
import { SoilCondition } from './soil-condition.model';
import { UsefulInfo } from './useful-info.model';

export class SiteSurveyReport {
    id: number;
    bidOpportunityId: number;
    nguoiTao: {
        id: number;
        name: string;
    };
    ngayTao: string;
    lanCapNhat: number;
    nguoiCapNhat: {
        id: number;
        name: string;
    };
    ngayCapNhat: number;
    noiDungCapNhat: string;
    tenTaiLieu: string;
    lanPhongVan: number;
    scaleOverall: ScaleOverall;
    describeOverall: DescribeOverall;
    traffic: Traffic;
    demoConso: DemoConso;
    serviceConstruction: ServiceConstruction;
    soilCondition: SoilCondition;
    usefulInfo: UsefulInfo[];
    updateDescription: string;
    viewFlag;
}