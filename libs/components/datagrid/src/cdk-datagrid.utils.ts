import { HiddenItemPayload, ItemPayload, itemPayloadDefault } from './cdk-datagrid-data.manager';

/**
 * setItemPayload sets an itemPayload on item in hidden-type-mode.
 * This means there is no direct access to itemPayload on returned item with TypeScript.
 * The advantage of this approach is that you can put implementation details
 * at type level in a hidden-type-mode so that it allows carry payload with an item.
 *
 * To get the itemPayload you should use getItemPayloadValue or getItemPayload.
 */
// prettier-ignore
export const setItemPayload = <
  Item,
>(item: Item, itemPayload: Partial<ItemPayload<Item>> = {}): Item => {
  const _item = item as Item & HiddenItemPayload<Item>;

  _item._$hiddenItemPayload = Object.assign(
    { ...itemPayloadDefault } as ItemPayload<Item>,
    { ..._item?._$hiddenItemPayload ?? {} } as ItemPayload<Item>,
    { ...itemPayload } as ItemPayload<Item>,
  );

  return _item as Item
};

/**
 * getItemPayloadValue returns a specific itemPayloadValue of a item by given key.
 */
// prettier-ignore
export const getItemPayloadValue = <
  Item,
  ItemPayloadKeys extends keyof ItemPayload<Item>,
  ItemPayloadValue extends ItemPayload<Item>[ItemPayloadKeys],
>(item: Item, key: ItemPayloadKeys): ItemPayloadValue => {
  const _item = item as Item & HiddenItemPayload<Item>;
  if (!_item?._$hiddenItemPayload) {
    console.log(_item);
    throw ErrorItemPayload(item);
  }

  return _item._$hiddenItemPayload[key] as ItemPayloadValue;
};

/**
 * getItemPayload returns itemPayload which is in hidden-type-mode
 */
// prettier-ignore
export const getItemPayload = <
  Item,
>(item: Item): Readonly<ItemPayload<Item>> => {
  const _item = item as Item & HiddenItemPayload<Item>;
  if (!_item?._$hiddenItemPayload) {
    console.log(_item);
    throw ErrorItemPayload(item);
  }

  return _item._$hiddenItemPayload as Readonly<ItemPayload<Item>>;
};

export const getItemData = <Item>(item: Item): object => {
  const _item = item as Item & HiddenItemPayload<Item>;
  if (!_item?._$hiddenItemPayload) throw ErrorItemPayload(item);

  const hiddenItemPayload = _item._$hiddenItemPayload;
  delete (_item as Partial<typeof _item>)._$hiddenItemPayload;
  const clonedData = structuredClone(_item);
  _item._$hiddenItemPayload = hiddenItemPayload;
  return clonedData;
};

/**
 * deleteItemPayload deletes the hidden item payload
 */
export const deleteItemPayload = <Item>(item: Partial<HiddenItemPayload<Item>>): Item => {
  delete item?._$hiddenItemPayload;
  return item as Item;
};

/**
 * hasItemPayload returns true if item has hidden item payload
 */
export const hasItemPayload = <Item>(item: Item) => {
  const _item = item as Item & HiddenItemPayload<Item>;
  return !!_item?._$hiddenItemPayload;
};

export const throwError = (message: string) => {
  throw new Error(message);
};

export const ErrorItemPayload = (item: unknown) => {
  return new Error(
    `HiddenItemPayload does not exists on "${JSON.stringify(item)}".` +
      'Please make sure it is set by using setItemPayload.',
  );
};
