import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { getItemPayload } from './cdk-datagrid.utils';
import { CdkDatagridDataManager, ItemPayload } from './cdk-datagrid-data.manager';
import { ACTION_DATA } from './mat-datagrid-input';

type ActionData<Item> = { item: Item };

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'cdk-datagrid-collapse',
  template: ``,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CdkDatagridCollapseComponent<Item> {
  constructor(
    @Inject(ACTION_DATA) public readonly _actionData: ActionData<Item>,
    private readonly _datasourceManager: CdkDatagridDataManager<Item>,
  ) {}

  @Output() collapseChange: EventEmitter<ItemPayload<Item>> = new EventEmitter();

  @HostBinding('class.cdk-datagrid-collapse') hostClass = true;
  @HostBinding('class.cdk-datagrid-collapsible') collapsibleClass = true;
  @HostBinding('class.cdk-datagrid-collapsed') get collapsedClass() {
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
