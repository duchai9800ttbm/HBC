import { MessageService } from '@progress/kendo-angular-l10n';

const messages = {
  'kendo.datepicker.today': 'Hôm nay'
};

export class MyMessageService extends MessageService {
  public get(key: string): string {
    return messages[key];
  }
}
