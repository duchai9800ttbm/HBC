export class SendEmailModel {
    subject: string;
    to: string;
    content: string;
    bidOpportunityId: number;

    get recipientEmails(): string[] {
        return this.to.split(',').map(i => i.trim());
    }
}
