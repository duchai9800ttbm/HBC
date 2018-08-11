import { ActivityModel } from '../index';

export interface TimelineOfDay {
    timelineDate: string;
    items: ActivityModel[];
}
