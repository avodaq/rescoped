import {
  HiddenItemPayload,
  ItemPayload,
  itemPayloadDefault,
} from '../src/cdk-datagrid-data.manager';
import {
  ErrorItemPayload,
  getItemPayload,
  getItemPayloadValue,
  setItemPayload,
} from '../src/cdk-datagrid.utils';
import { expectType } from 'ts-expect';

describe('CdkDatagridUtils', () => {
  type Item = { a: number };
  type ItemWithPayload = Item & HiddenItemPayload<object>;
  let item: Item;

  beforeEach(() => (item = { a: 1 }));

  // prettier-ignore
  function expectItemPayloadValue<
    Key extends keyof ItemPayload<Item>,
    Value extends ItemPayload<object>[Key],
  >(item: Item, key: Key, value: Value) {
    const optionValue = getItemPayloadValue(item, key);
    expect(optionValue).toEqual(value);
  }

  function expectDefaultItemPayload<_Item extends Item = Item>(item: _Item) {
    item = setItemPayload(item);
    expectType<_Item>(item);
    const itemWithRowOption = item as unknown as ItemWithPayload;
    expect(itemWithRowOption).toEqual({
      a: 1,
      _$hiddenItemPayload: itemPayloadDefault,
    });

    // getItemPayload
    const rowOptions: ItemPayload<object> = getItemPayload(item);
    expect(rowOptions).toEqual(itemPayloadDefault);

    // getItemPayloadValue
    expectItemPayloadValue(item, 'groupId', null);
    expectItemPayloadValue(item, 'parent', false);
    expectItemPayloadValue(item, 'collapsed', false);
    expectItemPayloadValue(item, 'selected', false);
    expectItemPayloadValue(item, 'filtered', false);
    expectItemPayloadValue(item, 'actionType', 'row-single');

    return item;
  }

  it('should create ErrorItemPayload', () => {
    expect(ErrorItemPayload({ a: 1 }).message).toEqual(
      `HiddenItemPayload does not exists on "{"a":1}".` +
        'Please make sure it is set by using setItemPayload.',
    );
  });

  it('should create item with default itemPayload', () => {
    item = expectDefaultItemPayload(item);
  });

  it('should create item with itemPayload and with multi overrides (merge)', () => {
    // setup
    // @todo: assign for example like a Device object in order to see the rules are correct typed
    const editedItemPayload: ItemPayload<object> = {
      id: '',
      index: 0,
      groupId: 123,
      parent: true,
      collapsed: true,
      selected: true,
      filtered: true,
      actionType: 'row-single',
      rules: null,
      active: false,
    };

    // first override with default
    item = expectDefaultItemPayload(item);

    // second override with custom editedItemPayload
    item = setItemPayload<Item>(item, editedItemPayload);
    const itemPayload = getItemPayload(item);
    expect(editedItemPayload).toEqual(itemPayload);

    expect(editedItemPayload).not.toEqual(itemPayloadDefault);
    expect(item as ItemWithPayload).toEqual({
      a: 1,
      _$hiddenItemPayload: { ...editedItemPayload },
    });

    // third override with one particular payload
    item = setItemPayload(item, { collapsed: false });
    expectItemPayloadValue(item, 'collapsed', false);
    expect(item as ItemWithPayload).toEqual({
      a: 1,
      _$hiddenItemPayload: { ...editedItemPayload, collapsed: false },
    });
  });
});
