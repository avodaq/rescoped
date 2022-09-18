import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { getItemPayload } from './cdk-spreadsheet.utils';
import { CdkSpreadsheetDataManager, ItemPayload } from './cdk-spreadsheet-data.manager';
import { ACTION_DATA } from './mat-spreadsheet-input';

type ActionData<Item> = { item: Item };

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'cdk-spreadsheet-collapse',
  template: ``,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdkSpreadsheetCollapseComponent<Item> {
  constructor(
    @Inject(ACTION_DATA) public readonly _actionData: ActionData<Item>,
    private readonly _datasourceManager: CdkSpreadsheetDataManager<Item>,
  ) {}

  @Output() collapseChange: EventEmitter<ItemPayload<Item>> = new EventEmitter();

  @HostBinding('class.cdk-spreadsheet-collapse') hostClass = true;
  @HostBinding('class.cdk-spreadsheet-collapsible') collapsibleClass = true;
  @HostBinding('class.cdk-spreadsheet-collapsed') get collapsedClass() {
    return this.collapsed;
  }

  get collapsed() {
    return getItemPayload(this._actionData.item).collapsed;
  }

  get getActionType() {
    return getItemPayload(this._actionData.item).actionType;
  }

  collapseChanged() {
    const itemPayload = getItemPayload(this._actionData.item);
    this._datasourceManager.toggleGroup(itemPayload);
    this.collapseChange.emit(itemPayload);
  }
}
