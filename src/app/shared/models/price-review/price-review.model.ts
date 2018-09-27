export class TenderPriceApproval {
    id: number;
    bidOpportunityId: number;
    createdEmployeeId?: number;
    updatedEmployeeId?: number;
    createdEmployee: {
        employeeId: number;
        employeeNo: string;
        employeeName: string;
        employeeAvatar: string;
        employeeEmail: string
    };
    updatedEmployee: {
        employeeId: number;
        employeeNo: string;
        employeeName: string;
        employeeAvatar: string;
        employeeEmail: string
    };
    isDraftVersion: boolean;
    approvalDate: number;
    approvalTimes: number;
    interviewTimes: number;
    isApprovedByTenderLeader: boolean;
    isApprovedByTenderManager: boolean;
    isApprovedByBoardOfDirector: boolean;
    projectInformation: {
        foudationPart: {
            scopeOfWorkIsInclude: boolean;
            scopeOfWorkDesc: string;
        };
        basementPart: {
            scopeOfWorkIsInclude: boolean;
            scopeOfWorkDesc: string;
        };
        basementPartConstructionStructure: {
            scopeOfWorkIsInclude: boolean;
            scopeOfWorkDesc: string;
        };
        basementPartConstructionCompletion: {
            scopeOfWorkIsInclude: boolean;
            scopeOfWorkDesc: string;
        };
        basementPartOtherWork: {
            scopeOfWorkIsInclude: boolean;
            scopeOfWorkDesc: string;
        };
        bodyPart: {
            scopeOfWorkIsInclude: boolean;
            scopeOfWorkDesc: string;
        };
        bodyPartConstructionStructure: {
            scopeOfWorkIsInclude: boolean;
            scopeOfWorkDesc: string;
        };
        bodyPartConstructionCompletion: {
            scopeOfWorkIsInclude: boolean;
            scopeOfWorkDesc: string;
        };
        bodyPartOtherWork: {
            scopeOfWorkIsInclude: boolean;
            scopeOfWorkDesc: string;
        };
        gfa: number;
    };
    technique: {
        constructionProgress: {
            folowTenderDocumentRequirement: string;
            suggestion: string;
            note: string
        };
        specialFeatureOfConstructionMethod: {
            folowTenderDocumentRequirement: string;
            suggestion: string;
            note: string
        };
        safetyRequirement: {
            folowTenderDocumentRequirement: string;
            suggestion: string;
            note: string
        };
        otherSpecialRequirement: {
            folowTenderDocumentRequirement: string;
            suggestion: string;
            note: string
        }
    };
    contractCondition: {
        advanceMoney: {
            tenderDocumentRequirementPercent: number;
            tenderDocumentRequirementDiscountPercent: number;
            suggestionPercent: number;
            suggestionDiscountPercent: number;
            note: string
        };
        paymentTime: {
            tenderDocumentRequirementDay: number;
            suggestionDay: number;
            note: string
        };
        retainedMoney: {
            tenderDocumentRequirementPercent: number;
            tenderDocumentRequirementMaxPercent: number;
            requirementPercent: number;
            requirementMaxPercent: number;
            note: string
        };
        punishDelay: {
            tenderDocumentRequirementPercent: number;
            tenderDocumentRequirementMax: number;
            suggestionPercent: number;
            suggestionMax: number;
            note: string
        };
        constructionWarrantyTime: {
            percent: number;
            money: number;
            bond: number;
            month: number;
            note: string
        };
        disadvantage: {
            disadvantageName: string;
            note: string
        }
    };
    tentativeTenderPrice: {
        costOfCapital: {
            baseTenderAmount: number;
            baseTenderGFA: number;
            alternativeTenderAmount: number;
            alternativeTenderGFA: number;
            note: string
        };
        costOfCapitalGeneralCost: {
            baseTenderAmount: number;
            baseTenderGFA: number;
            alternativeTenderAmount: number;
            alternativeTenderGFA: number;
            note: string
        };
        costOfCapitalValue: {
            baseTenderAmount: number;
            baseTenderGFA: number;
            alternativeTenderAmount: number;
            alternativeTenderGFA: number;
            note: string
        };
        costOfCapitalPCPSValue: {
            baseTenderAmount: number;
            baseTenderGFA: number;
            alternativeTenderAmount: number;
            alternativeTenderGFA: number;
            note: string
        };
        totalCostOfCapital: {
            baseTenderAmount: number;
            baseTenderGFA: number;
            alternativeTenderAmount: number;
            alternativeTenderGFA: number;
            note: string
        };
        totalCostOfCapitalProfitCost: {
            baseTenderProfitCost: number;
            alternativeProfitCost: number;
            note: string
        };
        totalCostOfSubmission: {
            baseTenderAmount: number;
            baseTenderGFA: number;
            alternativeTenderAmount: number;
            alternativeTenderGFA: number;
            note: string
        };
        oAndPPercentOfTotalCost: {
            baseTenderAmount: number;
            alternativeTenderAmount: number;
            note: string
        }
    };

}



export class TenderPriceApprovalShort {
    id: number;
    name: string;
    files: FileAttach[];
    interviewTimes: number;
    isDraftVersion: boolean;
    approvalTimes: number;
    createdEmployee: {
        employeeId: number,
        employeeNo: string,
        employeeName: string,
        employeeAvatar: string,
        employeeEmail: string
    };
    createdDate: number;
}

export class FileAttach {
    id: number;
    name: string;
    guid: string;
    url: string;
    desc: string;
    uploadDate: number;

}


export class ItemHSDTChinhThuc {
    typeName: string;
    document: {
        type: string,
        id: number,
        name: string,
        interviewTime: number,
    };
    childs?: ItemHSDTChinhThuc[];
}




export class PriceReviewItemChangedHistory {
    employee: {
        employeeId: number;
        employeeNo: string;
        employeeName: string;
        employeeAvatar: string;
        employeeEmail: string
    };
    changedTime: number;
    changedTimes: number;
    updateDesc: string;
    liveFormChangeds: PriceReviewLiveFormChangedHistory[];
}

export class PriceReviewLiveFormChangedHistory {
    liveFormStep: string;
    liveFormSubject: string;
    liveFormTitle: string;
    oldValue: string;
    newValue: string;
}
