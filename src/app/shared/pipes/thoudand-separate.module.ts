import { Pipe, PipeTransform } from '@angular/core';

const PADDING = '000000';

@Pipe({ name: 'thousandSeparate' })
export class ThousandSeparate implements PipeTransform {

  private DECIMAL_SEPARATOR: string;
  private THOUSANDS_SEPARATOR: string;
  private CURRENCY_UNIT: string;

  constructor() {
    // TODO comes from configuration settings
    this.DECIMAL_SEPARATOR = '.';
    this.THOUSANDS_SEPARATOR = ',';
    this.CURRENCY_UNIT = ' đ';
  }

  transform(value: number | string, fractionSize: number = 0): string {
    if (!value) { return ''; }
    if (isNaN(+value)) { return value.toString(); }

    let [integer, fraction = ''] = (+value).toString()
      .split(this.DECIMAL_SEPARATOR);

    fraction = fractionSize > 0
      ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
      : '';

    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.THOUSANDS_SEPARATOR);


    return integer + fraction;
  }

  parse(value: string, fractionSize: number = 0): number {
    if (!isNaN(+value)) { return +value; }

    let integer = (value || '').replace('', '');

    integer = integer.split(this.THOUSANDS_SEPARATOR).join('');

    return +integer;
  }

}
