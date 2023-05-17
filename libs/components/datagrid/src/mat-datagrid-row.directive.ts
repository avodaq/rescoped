import { Directive, HostBinding, Input } from '@angular/core';
import { ItemPayload } from './cdk-datagrid-data.manager';
import { getItemPayload } from './cdk-datagrid.utils';

const HOST_CLASS_PREFIX = 'cdk-datagrid';
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[cdk-datagrid-row]',
})
export class MatDatagridRowDirective<Item> {
  #itemPayload!: ItemPayload<Item>;

  @HostBinding('class') get actionType() {
    return `${HOST_CLASS_PREFIX}-${this.#itemPayload.actionType} ${HOST_CLASS_PREFIX}-group-id-${
      this.#itemPayload.groupId
    } ${HOST_CLASS_PREFIX}-parent-${this.#itemPayload.parent}`;
  }

  @Input() set item(item: Item) {
    this.#itemPayload = getItemPayload(item);
  }
}
