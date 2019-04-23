export class ConstructionTypeToYear {
    id: number;
    constructionType: {
        id: number;
        constructionTypeName: string;
        constructionTypeNameEng: string;
        constructionTypeDesc: string
    };
    percent: number;
    totalAmount: number;
    totalTargetAmount: number;
}
