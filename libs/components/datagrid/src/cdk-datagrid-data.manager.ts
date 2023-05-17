import { Injectable } from '@angular/core';
import { getItemPayload, setItemPayload } from './cdk-datagrid.utils';
import { Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { ComponentType } from '@angular/cdk/overlay';
import { DatagridValidation } from './cdk-datagrid-form-control.directive';

// MDC
import { MatTableDataSource } from '@angular/material/table';

export const itemPayloadDefault: ItemPayload<object> = {
  id: '',
  index: 0,
  active: true,
  groupId: null,
  parent: false,
  collapsed: false,
  selected: false,
  filtered: false,
  actionType: 'row-single',
  rules: null,
};

export interface HiddenItemPayload<Item> {
  _$hiddenItemPayload: ItemPayload<Item>;
}

export enum ItemActionIndex {
  rowGlobal = -99,
  rowGroup,
  rowSingle,
  rowSearchReplace,
}

export type ItemActionType =
  | 'row-global'
  | 'row-group'
  | 'row-single'
  | 'row-search-replace'
  | 'row-filter'
  | 'row-empty';

export interface RuleTypes {
  validate?: boolean;
  // @todo: have to be implemented in order to pass validation while data aggregation
  validators?: DatagridValidation;
  disable?: boolean;
  render?: boolean;
  placeholder?: string;
  action?: {
    componentType?: ComponentType<unknown>;
    componentPosition?: 'before' | 'after' | 'override';
    cond?: boolean | (() => boolean);
    data?: unknown;
    transform?: (item: any, key: any, value: any) => any;
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
export class CdkDatagridDataManager<
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

  splice(start: number, deleteCount = 0, items: Item[]) {
    this.#originalData.splice(start, deleteCount, ...items);
    this.#originalData = this.cloneItemAll();
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

    this.#originalData = this.cloneItemAll();
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

  getChildItems(item: Item) {
    const { groupId } = getItemPayload(item);
    return this.#originalData.filter(item => {
      const payload = getItemPayload(item);
      return (
        payload.groupId === groupId &&
        payload.parent === false &&
        payload.actionType === 'row-single'
      );
    });
  }

  getSingleItems() {
    return this.#originalData.filter(item => {
      const { actionType } = getItemPayload(item);
      return actionType === 'row-single';
    });
  }

  getParentItem(item: Item) {
    const { groupId } = getItemPayload(item);
    return this.#originalData.find(item => {
      const payload = getItemPayload(item);
      return payload.groupId === groupId && payload.parent === true;
    });
  }

  getGroupChildren(groupId: GroupId) {
    return this.#originalData.filter(item => {
      const { groupId: _groupId, parent, actionType } = getItemPayload(item);
      return _groupId === groupId && !parent && actionType === 'row-single';
    });
  }

  setValue<ItemKey extends keyof Item>(
    key: ItemKey,
    value: Item[ItemKey],
    item: Item,
    affectedItemsFn?: AffectedPayload,
  ) {
    const { actionType, groupId } = getItemPayload(item);

    if (actionType === 'row-single') {
      this.setSingleValue(item, key, value, affectedItemsFn);
    } else if (actionType === 'row-group' && typeof groupId === 'number' && groupId >= 0) {
      this.setGroupValues(key, value, groupId, affectedItemsFn);
    } else if (actionType === 'row-global') {
      this.setGlobalValues(key, value, affectedItemsFn);
    } else {
      throw new Error(`Unknown actionType: "${actionType}" or groupId: "${groupId}"`);
    }

    const valueChange = { key, value, actionType, groupId } as unknown as ValueChange;
    this.#valueChange$.next(valueChange);
  }

  setItemByKeyValue<ItemKey extends keyof Item>(item: Item, key: ItemKey, value: Item[ItemKey]) {
    if (item[key] === undefined) {
      throw new Error(`Invalid key: ${key.toString()} or no default item object is provided`);
    }
    item[key] = value;
  }
  setSingleValue<ItemKey extends keyof Item>(
    item: Item,
    key: ItemKey,
    value: Item[ItemKey],
    affectedItems?: AffectedPayload,
  ) {
    this.setItemByKeyValue(item, key, value);
    affectedItems?.(getItemPayload(item));
  }

  setGroupValues<ItemKey extends keyof Item>(
    key: ItemKey,
    value: Item[ItemKey],
    groupId: GroupId,
    affectedItems?: AffectedPayload,
  ) {
    this.#originalData.forEach(item => {
      const itemPayload = getItemPayload(item);
      if (itemPayload.groupId === groupId) {
        this.setItemByKeyValue(item, key, value);
        affectedItems?.(itemPayload);
      }
    });
  }

  setGlobalValues<ItemKey extends keyof Item>(
    key: ItemKey,
    value: Item[ItemKey],
    affectedItems?: AffectedPayload,
  ) {
    this.#originalData.forEach(Item => {
      const itemPayload = getItemPayload(Item);
      this.setItemByKeyValue(Item, key, value);
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

  getItemByIndex(index: number) {
    const item = this.#originalData[index];
    if (!item) {
      throw new Error(`
        Item with index "${index}" not found.
        Hint: update the index value if you have added or removed items!
      `);
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

  cloneItemAll(itemPayload: Partial<ItemPayload> = {}) {
    return this.#originalData.map((item, index) =>
      this.cloneItem(item, { ...itemPayload, index } as Partial<ItemPayload>),
    );
  }

  cloneItem(item: Item, itemPayload: Partial<ItemPayload> = {}) {
    const overrides = getItemPayload(item)?.rules?.overrides;
    const keyMaps: Map<
      ItemKey,
      {
        component?: ComponentType<unknown>;
        cond?: (() => boolean) | boolean;
        transform?: (item: any, key: any, value: any) => any;
      }
    > = new Map();

    if (typeof overrides === 'object') {
      const overridesKeys = <ItemKey[]>Object.keys(overrides);
      overridesKeys.forEach(key => {
        const action = getItemPayload(item)?.rules?.overrides?.[key]?.action;

        // action.componentType
        const component = action?.componentType;
        if (component) {
          keyMaps.set(key, { ...keyMaps.get(key), component });
          action.componentType = undefined;
        }

        // action.cond
        const cond = action?.cond;
        if (cond) {
          keyMaps.set(key, { ...keyMaps.get(key), cond });
          action.cond = undefined;
        }

        // action.transform
        const transform = action?.transform;
        if (transform) {
          keyMaps.set(key, { ...keyMaps.get(key), transform });
          action.transform = undefined;
        }
      });
    }

    item = structuredClone(item);

    keyMaps.forEach((componentType, key) => {
      const action = getItemPayload(item)?.rules?.overrides?.[key]?.action;
      if (action && componentType.component) {
        action.componentType = componentType.component;
      }
      if (action && componentType.cond) {
        action.cond = componentType.cond;
      }
      if (action && componentType.transform) {
        action.transform = componentType.transform;
      }
    });

    return setItemPayload(item, itemPayload);
  }

  #countActionType(item: Item) {
    const actionType = getItemPayload(item).actionType;
    actionType === 'row-single' ? this.countSingleItems++ : null;
    actionType === 'row-group' ? this.countGroupItems++ : null;
    return item;
  }

  destroy() {
    this.#dataSource.data = [];
    this.#originalData = [];
  }
}
