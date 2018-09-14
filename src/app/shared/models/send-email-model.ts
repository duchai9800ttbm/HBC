export class SendEmailModel {
    subject: string;
    to: string;
    cc: string;
    bcc: string;
    content: string;
    bidOpportunityId: number;

    get recipientEmails(): string[] {
        const to = this.to.split(',').map(i => i.trim());
        // const cc = this.cc.split(',').map(i => i.trim());
        // const bcc = this.bcc.split(',').map(i => i.trim());
        // return (to.concat(cc)).concat(bcc);
        return to;
    }
}
