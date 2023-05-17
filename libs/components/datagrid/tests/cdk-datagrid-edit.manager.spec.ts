import {
  CDK_EDIT_CSS_CLASS,
  CDK_EDIT_TAG_CLASS,
  CdkDatagridEdit,
  CdkDatagridEditManager,
} from '../src/cdk-datagrid-edit.manager';

describe('CdkDatagridEditManager', () => {
  let editManager: CdkDatagridEditManager;
  let editSpy: CdkDatagridEdit;

  beforeEach(() => {
    editSpy = jasmine.createSpyObj('cdkDatagridEdit', ['activeEdit', 'inactiveEdit']);
    editManager = new CdkDatagridEditManager();
  });

  it('should set, get, activate and delete an editItem', () => {
    // register, expect (setEditItem, getEditItem) and return CdkDatagridEdit
    const notInZoneEditEl = expectSetGetEdit(editManager, editSpy, '.invalid-because-outside');
    const fromInnerEdit = expectSetGetEdit(editManager, editSpy, '.valid-because-child');
    const fromItSelf = expectSetGetEdit(editManager, editSpy, '.cdk-datagrid-edit');
    const fromParent = expectSetGetEdit(editManager, editSpy, '.invalid-because-parent');

    // check active and inactive states
    editManager.setActiveEditItem(notInZoneEditEl.event);
    expect(editSpy.activeEdit).toHaveBeenCalledTimes(0);
    expect(editSpy.inactiveEdit).toHaveBeenCalledTimes(0);

    editManager.setActiveEditItem(fromInnerEdit.event);
    expect(editSpy.activeEdit).toHaveBeenCalledTimes(1);
    expect(editSpy.inactiveEdit).toHaveBeenCalledTimes(0);

    // when passing the same event as before (see above) then do nothing (see calls)
    editManager.setActiveEditItem(fromInnerEdit.event);
    expect(editSpy.activeEdit).toHaveBeenCalledTimes(1);
    expect(editSpy.inactiveEdit).toHaveBeenCalledTimes(0);

    editManager.setActiveEditItem(fromItSelf.event);
    expect(editSpy.activeEdit).toHaveBeenCalledTimes(2);
    expect(editSpy.inactiveEdit).toHaveBeenCalledTimes(1);

    editManager.setActiveEditItem(fromInnerEdit.event);
    expect(editSpy.activeEdit).toHaveBeenCalledTimes(3);
    expect(editSpy.inactiveEdit).toHaveBeenCalledTimes(2);

    editManager.setActiveEditItem(fromItSelf.event);
    expect(editSpy.activeEdit).toHaveBeenCalledTimes(4);
    expect(editSpy.inactiveEdit).toHaveBeenCalledTimes(3);

    editManager.setActiveEditItem(fromParent.event);
    expect(editSpy.activeEdit).toHaveBeenCalledTimes(4);
    expect(editSpy.inactiveEdit).toHaveBeenCalledTimes(4);

    // delete registered editItems
    editManager.deleteEditItem(notInZoneEditEl.editElRef);
    expect(editManager.getEditItem(notInZoneEditEl.editElRef)).toBeUndefined();

    editManager.deleteEditItem(fromInnerEdit.editElRef);
    expect(editManager.getEditItem(fromInnerEdit.editElRef)).toBeUndefined();

    editManager.deleteEditItem(fromItSelf.editElRef);
    expect(editManager.getEditItem(fromItSelf.editElRef)).toBeUndefined();

    editManager.deleteEditItem(fromParent.editElRef);
    expect(editManager.getEditItem(fromParent.editElRef)).toBeUndefined();

    // when everything is deleted then call count should stat as it is.
    // see: setActiveEditItem(fromParent.editEl)
    editManager.setActiveEditItem(fromParent.event);
    expect(editSpy.activeEdit).toHaveBeenCalledTimes(4);
    expect(editSpy.inactiveEdit).toHaveBeenCalledTimes(5);
  });
});

type Query =
  | '.invalid-because-outside'
  | '.invalid-because-parent'
  | '.valid-because-child'
  | '.cdk-datagrid-edit';

function expectSetGetEdit(
  editManager: CdkDatagridEditManager,
  editSpy: CdkDatagridEdit,
  query: Query,
) {
  const [event, editEl, editElRef] = fixtureDatagridState(query);
  editManager.setEditItem(editElRef, editSpy);
  expect(editManager.getEditItem(editElRef)).toEqual(editSpy);
  return { editEl, editElRef, event };
}

class EventMock {
  target!: HTMLElement;
}

function fixtureDatagridState(query: Query) {
  const div = document.createElement('div');
  div.innerHTML = `
    <div class='invalid-because-outside'>I am outside<div>
    <div class='invalid-because-parent'>
      <div class='${CDK_EDIT_TAG_CLASS}'> <!-- valid: it has the CDK_EDIT_TAG_CLASS -->
        <div class='valid-because-child'></div>
      </div>
    <div>
  `;

  const event = new EventMock();
  event.target = div.querySelector(query) as HTMLElement;
  return [
    event as unknown as Event,
    div.querySelector(query) as HTMLElement,
    div.querySelector(CDK_EDIT_CSS_CLASS) as HTMLElement,
  ] as [Event, HTMLElement, HTMLElement];
}
