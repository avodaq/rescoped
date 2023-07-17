import { Directive, Input } from '@angular/core';
import { CdkDatagridFormManager } from './cdk-datagrid-form.manager';
import { getItemData, getItemPayloadValue, setItemPayload, throwError } from './cdk-datagrid.utils';
import { CdkDatagridDataManager, ItemActionType } from './cdk-datagrid-data.manager';
import { CdkDatagridRuleManager } from './cdk-datagrid-rule.manager';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[cdk-datagrid-edit]',
  standalone: true,
})
export class CdkDatagridStorageDirective<
  Item,
  ItemKey extends keyof Item = keyof Item,
  ItemValue extends Item[ItemKey] = Item[ItemKey],
> {
  constructor(
    private readonly _dataSourceManager: CdkDatagridDataManager<Item>,
    private readonly _formManager: CdkDatagridFormManager<Item>,
    private readonly _ruleManager: CdkDatagridRuleManager<Item>,
  ) {}

  @Input() item!: Item;

  @Input() key!: keyof Item;
  @Input() render!: keyof Item;
  get renderKey() {
    return this.render || this.key || throwError('@Input().key or @Input().render is missing');
  }

  get placeholder() {
    const action = getItemPayloadValue(this.item, 'actionType');
    return this._ruleManager.getRule(this.item, this.key, action)?.placeholder;
  }

  get groupId() {
    return getItemPayloadValue(this.item, 'groupId');
  }

  get index() {
    return getItemPayloadValue(this.item, 'index');
  }

  @Input() get actionType(): ItemActionType {
    return `${getItemPayloadValue(this.item, 'actionType')}`;
  }

  createUuid() {
    return `${getItemPayloadValue(this.item, 'index')}-${String(this.key)}`;
  }

  setValue(value: unknown) {
    let valueByKey = value as unknown as ItemValue;
    if (typeof value === 'object') {
      valueByKey = (value as unknown as Item)[this.key] as ItemValue;
    } else if (typeof value === 'string') {
      value = value.trim();
    }

    const actionType = getItemPayloadValue(this.item, 'actionType');
    const action = this._ruleManager.getActionRule(this.item, this.key, actionType);

    let itemData = { [this.key]: valueByKey };
    if (action?.transform) {
      itemData = getItemData(this.item) as { [key: string]: ItemValue };
      itemData = action.transform(itemData, this.key, value);
    }

    this._dataSourceManager.setValue(this.key, valueByKey, this.item, payload => {
      const id = `${payload.index}-${String(this.key)}`;
      const formControl = this._formManager.getFormControl(id);
      if (!formControl) return;

      const item = setItemPayload({} as Item, payload);
      const actionType = payload.actionType;
      this._ruleManager.applyRules(item, this.key, actionType, formControl, value as string);
    });

    let valueByRender = value as unknown;
    if (typeof value === 'object') {
      valueByRender = (value as unknown as Item)[this.render];
    }
    if (this.renderKey && valueByRender) {
      this._dataSourceManager.setValue(this.renderKey, valueByRender as ItemValue, this.item);
    }
  }
}
