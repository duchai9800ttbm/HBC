import { CheckboxSelection } from "../checkbox-selected.model";

export class ActivityListItem extends CheckboxSelection {
        id: number;
        name: string;
        startDate: number;
        endDate: number;
        status: string;
        address: string;
        relatedToType: string;
        specificRelated: {
                id: number;
                name: string;
        };
        assignTo: string;
        activityType: string;
        eventType: string;
}
