import { ScaleOverall } from './scale-overall.model';
import { DescribeOverall } from './describe-overall.model';
import { Traffic } from './traffic.model';
import { DemoConso } from './demo-conso.model';
import { ServiceConstruction } from './service-construction.model';
import { SoilCondition } from './soil-condition.model';
import { UsefulInfo } from './useful-info.model';

export class SiteSurveyReport {
    isCreate: boolean;
    id: number;
    bidOpportunityId: number;
    nguoiTao: {
        id: number;
        name: string;
    };
    nguoiCapNhat: {
        id: number;
        name: string;
    };
    isDraft: boolean;
    phongBan: {
        id: number,
        key: string,
        text: string
    };
    nguoiKhaoSat: {
        id: number,
        text: string
    };
    ngayTao: string;
    lanCapNhat: number;
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
}
