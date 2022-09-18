import { Injectable } from '@angular/core';
import { getItemPayload, setItemPayload } from './cdk-spreadsheet.utils';
import { Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { ComponentType } from '@angular/cdk/overlay';
import { MatTableDataSource } from '@angular/material/table';
import { SpreadsheetValidation } from './cdk-spreadsheet-form-control.directive';

// @todo: workaround as long typeScript has not update typing!
declare function structuredClone(value: any, options?: StructuredSerializeOptions): any;

export const itemPayloadDefault: ItemPayload<object> = {
  id: '',
  index: 0,
  active: true,
  groupId: null,
  parent: false,
  collapsed: false,
  selected: false,
  filtered: false,
  actionType: 'single-edit',
  rules: null,
};

export interface HiddenItemPayload<Item> {
  _$hiddenItemPayload: ItemPayload<Item>;
}

export enum ItemActionIndex {
  globalEdit = -99,
  groupEdit,
  singleEdit,
  searchReplace,
}

export type ItemActionType =
  | 'global-edit'
  | 'group-edit'
  | 'single-edit'
  | 'search-replace'
  | 'filter'
  | 'empty';

export interface RuleTypes {
  validate?: boolean;
  // @todo: have to be implemented in order to pass validation while data aggregation
  validators?: SpreadsheetValidation;
  disable?: boolean;
  render?: boolean;
  placeholder?: string;
  action?: {
    componentType?: ComponentType<unknown>;
    componentPosition?: 'before' | 'after' | 'override';
    cond?: boolean | (() => boolean);
    data?: unknown;
  };
}

export interface ItemRules<Item> extends RuleTypes {
  overrides?: {
    [itemKeys in keyof Item]?: RuleTypes;
  };
}

export type GlobalRules<Item, _ItemActionType extends ItemActionType = ItemActionType> = {
  [actionType in _ItemActionType]?: ItemRules<Item>;
};

export interface ItemPayload<Item> {
  id: string; // https://github.com/ai/nanoid
  index: number;
  active: boolean;
  parent: boolean;
  collapsed: boolean | null;
  groupId: number | null;
  selected: boolean;
  filtered: boolean;
  actionType: ItemActionType;
  rules: ItemRules<Item> | null;
}

export type ItemSlotId = number | string;
export type _ItemPayload<Item> = ItemPayload<Item>;
export type ItemSlot<Item> = Map<ItemSlotId, Item>;
export type _AffectedPayload<Item> = (payload: ItemPayload<Item>) => void;
export type GroupId = ItemPayload<object>['groupId'];

export type ValueChange = {
  key: string;
  value: string;
  actionType: ItemActionType;
  groupId: GroupId;
};

@Injectable()
export class CdkSpreadsheetDataManager<
  Item,
  ItemKey extends keyof Item = keyof Item,
  ItemPayload extends _ItemPayload<Item> = _ItemPayload<Item>,
  AffectedPayload extends _AffectedPayload<Item> = _AffectedPayload<Item>,
> {
  readonly #valueChange$ = new Subject<ValueChange | null>();
  readonly valueChange$ = this.#valueChange$.pipe(startWith(null));

  readonly #dataTableSlot: ItemSlot<Item | ItemPayload> = new Map<ItemSlotId, Item>();

  countSingleItems = 0;
  countGroupItems = 0;

  #dataSource!: MatTableDataSource<Item>;

  #originalData: Item[] = [];

  set dataSource(dataSource: MatTableDataSource<Item>) {
    this.#dataSource = dataSource;
    this.#originalData = dataSource.data.map((item, index) =>
      this.#countActionType(setItemPayload(item, { index })),
    );
  }

  get data(): Item[] {
    return this.#originalData;
  }

  setValueChange(value: ValueChange | null) {
    this.#valueChange$.next(value);
  }

  // @note: what happens when for example "data: { }" contains which is not cloneable?
  // @idea: instead of taking out component and placing in we can register by name when
  // registering CdkSpreadsheetModule.forRoot({actionComponents: {'single-edit': SingleEditComponent, etc.}})
  // @todo: see also in toplevel! so one up like ../ maybe we should use getRule()?
  splice(start: number, deleteCount = 0, items: Item[]) {
    items = items.map(item => {
      const overrides = getItemPayload(item)?.rules?.overrides;
      const keyMaps: Map<ItemKey, ComponentType<unknown>> = new Map();

      if (typeof overrides === 'object') {
        const overridesKeys = <ItemKey[]>Object.keys(overrides);
        overridesKeys.forEach(key => {
          const component = getItemPayload(item)?.rules?.overrides?.[key]?.action?.componentType;
          const action = getItemPayload(item)?.rules?.overrides?.[key]?.action;
          if (typeof action === 'object' && typeof component === 'function') {
            action.componentType = undefined;
          }

          if (typeof action === 'object' && typeof component === 'function') {
            keyMaps.set(key, component);
          }
        });
      }

      item = structuredClone(item);
      keyMaps.forEach((componentType, key) => {
        const action = getItemPayload(item)?.rules?.overrides?.[key]?.action;
        if (typeof action === 'object' && typeof componentType === 'function') {
          action.componentType = componentType;
        }
      });
      return item;
    });

    this.#originalData.splice(start, deleteCount, ...items);
    this.#originalData = this.#originalData.map((item, index) => {
      if (index >= start) {
        item = setItemPayload(item, { index });
        return { ...item };
      } else {
        return setItemPayload(item, { index });
      }
    });

    this.#dataSource.data = this.#originalData;
  }

  delete(item: Item, includeChildren = false) {
    const payload = getItemPayload(item);
    const _index = payload.index;
    const groupId = payload.groupId;
    const parent = payload.parent;

    this.#originalData = this.#originalData.filter(item => {
      return (
        (!parent && getItemPayload(item).index !== _index) ||
        (includeChildren && parent && getItemPayload(item).groupId !== groupId)
      );
    });

    this.#originalData = this.#originalData.map((item, index) => {
      if (index >= _index) {
        item = setItemPayload(item, { index });
        return { ...item };
      } else {
        return setItemPayload(item, { index });
      }
    });

    this.#dataSource.data = this.#originalData;
  }
  /**
   * This method is useful when you want to add dynamic a runtime an item to the table.
   */
  addDataSlotItem(itemPayload: Partial<ItemPayload>, item?: Item) {
    const { id, actionType, active } = itemPayload;

    if (!id) throw new Error('id is required');
    if (!actionType) throw new Error('actionType is required');

    let _item = this.getDataTableItem(id);
    if (!_item) {
      _item = setItemPayload(_item ?? (item || ({} as Item)), itemPayload);
      this.#dataTableSlot.set(id, _item);
    } else {
      _item = setItemPayload(_item, { active });
    }

    if (active) {
      this.#originalData.splice(0, 0, _item);
    } else if (!active) {
      const index = this.#dataSource.data.indexOf(_item);
      this.#originalData.splice(index, 1);
    }

    this.#dataSource.data = this.#originalData.filter(
      item => !getItemPayload(item).collapsed || getItemPayload(item).parent,
    );
  }

  getDataTableItem(id: ItemSlotId) {
    return this.#dataTableSlot.get(id) as Item;
  }

  setValue<ItemKey extends keyof Item>(
    key: ItemKey,
    value: Item[ItemKey],
    item: Item,
    affectedItemsFn?: AffectedPayload,
  ) {
    const { actionType, groupId } = getItemPayload(item);

    if (actionType === 'single-edit') {
      this.setSingleValue(item, key, value, affectedItemsFn);
    } else if (actionType === 'group-edit' && typeof groupId === 'number' && groupId >= 0) {
      this.setGroupValues(key, value, groupId, affectedItemsFn);
    } else if (actionType === 'global-edit') {
      this.setGlobalValues(key, value, affectedItemsFn);
    } else {
      throw new Error(`Unknown actionType: "${actionType}" or groupId: "${groupId}"`);
    }

    const valueChange = { key, value, actionType, groupId } as unknown as ValueChange;
    this.#valueChange$.next(valueChange);
  }

  setSingleValue<ItemKey extends keyof Item>(
    item: Item,
    key: ItemKey,
    value: Item[ItemKey],
    affectedItems?: AffectedPayload,
  ) {
    item[key] = value;
    affectedItems?.(getItemPayload(item));
  }

  setGroupValues<ItemKey extends keyof Item>(
    key: ItemKey,
    value: Item[ItemKey],
    groupId: GroupId,
    affectedItems?: AffectedPayload,
  ) {
    this.#originalData.forEach(dataItem => {
      const itemPayload = getItemPayload(dataItem);
      if (itemPayload.groupId === groupId) {
        dataItem[key] = value;
        affectedItems?.(itemPayload);
      }
    });
  }

  setGlobalValues<ItemKey extends keyof Item>(
    key: ItemKey,
    value: Item[ItemKey],
    affectedItems?: AffectedPayload,
  ) {
    this.#originalData.forEach(dataItem => {
      const itemPayload = getItemPayload(dataItem);
      dataItem[key] = value;
      affectedItems?.(itemPayload);
    });
  }

  toggleGroup(itemPayload: ItemPayload) {
    this.#dataSource.data = this.#originalData.filter(item => {
      const _item = getItemPayload(item);
      if (itemPayload.groupId === _item.groupId) {
        item = setItemPayload(item, { collapsed: !_item.collapsed });
      }
      return !getItemPayload(item).collapsed || getItemPayload(item).parent;
    });
  }

  getEmptyItem(item: Item, actionType: ItemActionType) {
    return setItemPayload(item, { actionType });
  }

  getItemByIndex(index: number) {
    const item = this.#originalData[index];
    if (!item) {
      throw new Error(`Item with index "${index}" not found`);
    }

    return this.#originalData[index];
  }

  getParentItemByGroupId(groupId: number) {
    const item = this.#originalData.find(item => {
      const _item = getItemPayload(item);
      return _item.groupId === groupId && _item.parent;
    });

    if (!item) {
      throw new Error(`Item with groupId "${groupId}" not found`);
    }

    return item;
  }

  #countActionType(item: Item) {
    const actionType = getItemPayload(item).actionType;
    actionType === 'single-edit' ? this.countSingleItems++ : null;
    actionType === 'group-edit' ? this.countGroupItems++ : null;
    return item;
  }

  destroy() {
    this.#dataSource.data = [];
    this.#originalData = [];
  }
}
