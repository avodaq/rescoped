import { Directive, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { CdkSpreadsheetDirective } from './cdk-spreadsheet.directive';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[connectWithSpreadsheet]',
})
export class CdkSpreadsheetConnectWithDirective<Item> implements OnInit {
  @Input() connectWithSpreadsheet: CdkSpreadsheetDirective<Item> | null = null;

  @Output() clickForSpreadsheetItems = new EventEmitter<Item[]>();

  @HostListener('click') clickSpreadsheetAction() {
    if (this.connectWithSpreadsheet) {
      this.clickForSpreadsheetItems.emit(this.connectWithSpreadsheet.items);
      this.connectWithSpreadsheet.setValueChange(null);
    }
  }

  ngOnInit() {
    if (!this.connectWithSpreadsheet) {
      throw new Error('[cdk-spreadsheet-action] must have a [connectWithSpreadsheet] input');
    }

    const instanceOfSpreadsheet = this.connectWithSpreadsheet instanceof CdkSpreadsheetDirective;
    if (this.connectWithSpreadsheet && !instanceOfSpreadsheet) {
      throw new Error('[connectWithSpreadsheet] input must of type CdkSpreadsheetDirective');
    }
  }
}
