import { Directive, HostBinding, Input } from '@angular/core';
import { ItemPayload } from './cdk-spreadsheet-data.manager';
import { getItemPayload } from './cdk-spreadsheet.utils';

const HOST_CLASS_PREFIX = 'cdk-spreadsheet';
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[cdk-spreadsheet-row]',
})
export class MatSpreadsheetRowDirective<Item> {
  #itemPayload!: ItemPayload<Item>;

  @HostBinding('class') get actionType() {
    return `${HOST_CLASS_PREFIX}-${this.#itemPayload.actionType}`;
  }

  @Input() set item(item: Item) {
    this.#itemPayload = getItemPayload(item);
  }
}
