import { Consultant } from './consultant';
import { Employer } from './employer';
import { ClosingTime } from './closing-time';

export class RequestTenderClarification {
    consultant: Consultant;
    employer: Employer;
    closingTime: ClosingTime;
}
