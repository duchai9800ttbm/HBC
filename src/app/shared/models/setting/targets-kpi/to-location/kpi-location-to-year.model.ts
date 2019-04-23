export class KpiLocationToYear {
    year: number;
    preYearTarget: {
        id: number;
        location: {
            id: number;
            locationName: string;
            locationNo: string;
            locationDesc: string
        };
        amount: number
    } [];
    curYearTarget: {
        id: number;
        location: {
            id: number;
            locationName: string;
            locationNo: string;
            locationDesc: string
        };
        amount: number
    }[];
}
