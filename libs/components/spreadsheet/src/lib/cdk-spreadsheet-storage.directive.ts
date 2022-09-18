import { Directive, Input } from '@angular/core';
import { CdkSpreadsheetFormManager } from './cdk-spreadsheet-form.manager';
import { getItemPayloadValue, setItemPayload, throwError } from './cdk-spreadsheet.utils';
import { CdkSpreadsheetDataManager, ItemActionType } from './cdk-spreadsheet-data.manager';
import { CdkSpreadsheetRuleManager } from './cdk-spreadsheet-rule.manager';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[cdk-spreadsheet-edit]',
})
export class CdkSpreadsheetStorageDirective<
  Item,
  ItemKey extends keyof Item = keyof Item,
  ItemValue extends Item[ItemKey] = Item[ItemKey],
> {
  constructor(
    private readonly _dataSourceManager: CdkSpreadsheetDataManager<Item>,
    private readonly _formManager: CdkSpreadsheetFormManager<Item>,
    private readonly _ruleManager: CdkSpreadsheetRuleManager<Item>,
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

    this._dataSourceManager.setValue(this.key, valueByKey, this.item, payload => {
      const id = `${payload.index}-${String(this.key)}`;
      const formControl = this._formManager.getFormControl(id);
      if (!formControl) return;

      const item = setItemPayload({} as Item, payload);
      const actionType = payload.actionType;
      // @todo: this work only with item.actionType but not with this.actionType
      this._ruleManager.applyRules(item, this.key, actionType, formControl, value as string);
    });

    let valueByRender = value as unknown;
    if (typeof value === 'object') {
      valueByRender = (value as unknown as Item)[this.render];
    }
    if (this.renderKey && valueByRender) {
      // @todo: e.g. when using groupEdit this.render becomes undefined
      this._dataSourceManager.setValue(this.render, valueByRender as ItemValue, this.item);
    }
  }
}
