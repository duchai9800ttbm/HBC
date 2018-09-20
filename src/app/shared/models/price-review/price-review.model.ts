export class TenderPriceApproval {
    id: number;
    bidOpportunityId: number;
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
    isDraftVersion: true;
    approvalDate: number;
    approvalTimes: number;
    isApprovedByTenderLeader: true;
    isApprovedByTenderManager: true;
    isApprovedByBoardOfDirector: true;
    projectInformation: {
        foudationPart: {
            scopeOfWorkIsInclude: true;
            scopeOfWorkDesc: string;
            gfa: number
        };
        basementPart: {
            scopeOfWorkIsInclude: true;
            scopeOfWorkDesc: string;
            gfa: number
        };
        basementPartConstructionStructure: {
            scopeOfWorkIsInclude: true;
            scopeOfWorkDesc: string;
            gfa: number
        };
        basementPartConstructionCompletion: {
            scopeOfWorkIsInclude: true;
            scopeOfWorkDesc: string;
            gfa: number
        };
        basementPartOtherWork: {
            scopeOfWorkIsInclude: true;
            scopeOfWorkDesc: string;
            gfa: number
        };
        bodyPart: {
            scopeOfWorkIsInclude: true;
            scopeOfWorkDesc: string;
            gfa: number
        };
        bodyPartConstructionStructure: {
            scopeOfWorkIsInclude: true;
            scopeOfWorkDesc: string;
            gfa: number
        };
        bodyPartConstructionCompletion: {
            scopeOfWorkIsInclude: true;
            scopeOfWorkDesc: string;
            gfa: number
        };
        bodyPartOtherWork: {
            scopeOfWorkIsInclude: true;
            scopeOfWorkDesc: string;
            gfa: number
        }
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
