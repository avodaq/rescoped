import { Directive, HostBinding } from '@angular/core';
import { CdkSpreadsheetDirective } from './cdk-spreadsheet.directive';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'mat-table[mat-spreadsheet]',
  exportAs: 'matSpreadsheet',
})
export class MatSpreadsheetDirective<
  Item extends object = object,
> extends CdkSpreadsheetDirective<Item> {
  @HostBinding('class.mat-spreadsheet') override hostClass = true;
}
