import { Inject, Injectable, InjectionToken } from '@angular/core';
import { DateAdapter, MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';

export const MAT_FORMAT_DATE_INPUT = new InjectionToken<string>('dateFormatValue');

export const MAT_DATE_CLASS = new InjectionToken<MatDateClass>('matDateAdapter');

export type MatDateClass = (value: unknown) => unknown;

interface DateAdapterFormatter extends Pick<DateAdapter<unknown>, 'format'> {}

export const matDateFormatsDefaults: MatDateFormats = {
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
  parse: {
    dateInput: ['YYYY-MM-DD'],
  },
};

@Injectable()
export class CdkSpreadsheetDateAdapter implements DateAdapterFormatter {
  constructor(
    @Inject(MAT_DATE_CLASS) private readonly matDateClass: MatDateClass,
    @Inject(MAT_DATE_FORMATS) public readonly matDateFormats: MatDateFormats,
    @Inject(MAT_FORMAT_DATE_INPUT) public readonly matFormatDateInput: string,
    private readonly _dateAdapter: DateAdapter<unknown>,
  ) {}

  format(date: Date | string | unknown, format: string) {
    if (!date) return '';
    return this._dateAdapter.format(this.matDateClass(date), format);
  }
}
