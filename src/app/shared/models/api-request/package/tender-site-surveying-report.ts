export class TenderSiteSurveyingReport {
    // class lol gì đây, model API trả về à ? uhm
    // vãi lol, mình ko kiểm soát vụ đó
    // nó thích trả về cái gì kệ nó
    // tạo class để làm gì
    // mà tạo thì quá tốt nhưng cũng đéo làm gì
    // thật ra nó có lợi đôi chút, đôi chút thôi
    // giúp cho editor nó thông minh hơn 1 chút
    // nhưng ko nên tạo class này
    // class này hôm nay mới tạo đúng ko ? uhm
    // có sử dụng ở đâu ko documentService vaf component
    id: number;
    bidOpportunityId: number;
    createdEmployee: Employee;
    updatedEmployee: Employee;
    isDraftVersion: boolean;
    projectStatistic: ProjectStatistic;
    siteInformation: SiteInformation;
    transportationAndSiteEntranceCondition: TransportationAndSiteEntranceCondition;
    demobilisationAndConsolidation: DemobilisationAndConsolidation;
    temporaryBuildingServiceForConstruction: TemporaryBuildingServiceForConstruction;
    reportExistingSoilCondition: ReportExistingSoilCondition;
    usefulInFormations: UsefulInFormations[];
}



export class ProjectStatistic {
    projectStatistic: {
        constructionType: [
            {
                key: string,
                value: string,
                displayText: string
            }
        ],
        siteArea: number,
        totalNumberOfFloor: string,
        constructionPeriod: number
    };
    perspectiveImageOfProject: DescContent;
    existingStructure: DescContent;
    specialRequirement: DescContent;
}

export class SiteInformation {
    topography: DescContent;
    existBuildingOnTheSite: DescContent;
    existObstacleOnTheSite: DescContent;
}

export class TransportationAndSiteEntranceCondition {
    disadvantage: DescContent;
    advantage: DescContent;
    directionOfSiteEntrance: DescContent;
    existingRoadOnSite: DescContent;
    temporatyRoadRequirement: DescContent;
    temporaryFenceRequirement: DescContent;
}

export class DemobilisationAndConsolidation {
    demobilisationExistingStructureOrBuilding: DescContent;
    consolidationExistingStructureOrBuilding: DescContent;
    adjacentBuildingConditions: DescContent;
}

export class TemporaryBuildingServiceForConstruction {
    supplyWaterSystemExistingSystem: DescContent;
    supplyWaterSystemExistingConnectionPoint: DescContent;
    drainageWaterSystemExistingSystem: DescContent;
    drainageWaterSystemExistingConnectionPoint: DescContent;
    transformerStation: DescContent;
    existingMediumVoltageSystem: DescContent;
    others: DescContent;
}

export class ReportExistingSoilCondition {
    existingFooting: DescContent;
    soilInvestigation: DescContent;
}

export class UsefulInFormations {
    title: string;
    content: ContentUsefulInfomations[];
}

export class DescContent {
    desc: string;
    images: Images[];
    imageUrls: ImageUrls[];
}

export class Employee {
    employeeId: number;
    employeeNo: string;
    employeeName: string;
    employeeAvatar: string;
}

export class ImageUrls {
    guid: string;
    thumbSizeUrl: string;
    largeSizeUrl: string;
}

export class Images {
    contentType: string;
    contentDisposition: string;
    headers: {};
    length: number;
    name: string;
    fileName: string;
}

export class ContentUsefulInfomations {
    name: string;
    detail: string;
    images: Images[];
    imageUrls: ImageUrls[];
}
