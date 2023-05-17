import { Injectable } from '@angular/core';

/**
 * The CDK_EDIT_TAG_CLASS is a unique identifier whose use should match the CdkDatagridEdit
 * interface in the directive where it is used.
 *
 * @example CdkDatagridEditDirective in cdk-datagrid-edit.directive.ts
 */
export const CDK_EDIT_TAG_CLASS = 'cdk-datagrid-edit';

/**
 * The CDK_EDIT_CSS_CLASS is used to query the proper html dom node reference in order to get the
 * directive instance of CdkDatagridEdit interface.
 */
export const CDK_EDIT_CSS_CLASS = `.${CDK_EDIT_TAG_CLASS}`;

/**
 * The CdkMapEdit stores a collection of html dom node references and directive instances of
 * CdkDatagridEdit.
 */
export type CdkMapEdit = Map<HTMLElement, CdkDatagridEdit>;

/**
 * An interface which should be used in the corresponding Directive.
 *
 * @example CdkDatagridEditDirective in cdk-datagrid-edit.directive.ts
 */
export interface CdkDatagridEdit {
  activeEdit(): void;
  inactiveEdit(): void;
}

/**
 * An event which hold in target the HTMLElement which is exactly the one in CdkMapEdit
 *
 * @see CdkMapEdit
 */
export interface EventWithTarget<Element> {
  target: Element;
}

/**
 * CdkDatagridEditManager provides some useful methods for write, read, delete or interacting
 * with directive instances of CdkDatagridEdit.
 *
 * @example test/cdk-datagrid-edit.manager.spec.ts
 */
@Injectable()
export class CdkDatagridEditManager<
  Element extends HTMLElement = HTMLElement,
  _Event extends EventWithTarget<Element> = EventWithTarget<Element>,
  Editable extends CdkDatagridEdit = CdkDatagridEdit,
> {
  /**
   * inCellZone is a boolean which indicates if the mouse event is in the cell zone.
   */
  inCellZone = false;

  /**
   * @see CdkMapEdit in cdk-datagrid-edit.manager.ts
   *
   * @internal
   **/
  readonly #edits: CdkMapEdit = new Map();

  /**
   * The #lastEditItemEl is the last edited element.
   *
   * @internal
   */
  #lastEditItemEl: Element | undefined;

  /**
   * The #lastEditItemRef is the last edited CdkDatagridEdit reference.
   *
   * @internal
   */
  #lastEditItemRef: CdkDatagridEdit | undefined;

  /**
   * setActiveEditItem extracts and finds the right CDK_EDIT_CSS_CLASS domNode
   * from event.target in order to pull the correct directive instance from CdkMapEdit to interact
   * with CdkDatagridEdit.activeEdit() and CdkDatagridEdit.inactiveEdit().
   */
  setActiveEditItem(event: Event) {
    const currentEditAbleItemEl = this.getCurrentItem(event);
    if (!currentEditAbleItemEl) {
      return;
    }

    if (this.#lastEditItemEl === currentEditAbleItemEl) {
      return;
    }

    if (this.#lastEditItemEl) {
      this.setInactiveLastEditItem();
    }

    this.#storeLastEditItem(currentEditAbleItemEl);
    this.getEditItem(currentEditAbleItemEl)?.activeEdit();
  }

  /**
   * setEditItem sets element and editable in CdkMapEdit
   */
  setEditItem(element: Element, editable: Editable) {
    this.#edits.set(element, editable);
  }

  /**
   * getEditItem returns the directive instance by given element reference
   */
  getEditItem(element: Element) {
    return this.#edits.get(element);
  }

  /**
   * setInactiveEditItem sets the item to inactive.
   */
  setInactiveEditItem(event: Event) {
    const currentEditAbleItemEl = this.getCurrentItem(event);
    if (!currentEditAbleItemEl) {
      return;
    }

    this.getEditItem(currentEditAbleItemEl)?.inactiveEdit();
    // @todo: remove this later when keyboard moving is working. This is just for avoiding tabbing!
    event.preventDefault();
  }

  /**
   * deleteEditItem deletes the directive instance from CdkMapEdit by given element reference
   */
  deleteEditItem(element: Element) {
    const deleted = this.#edits.delete(element);
    const directive = this.getEditItem(element);
    if (deleted && directive) directive.inactiveEdit();
  }

  isInZoneEditItem(event: Event) {
    const currentEditItemEl = this.#getElementFromEvent(event);
    return (this.inCellZone = this.#isInZoneEditEl(currentEditItemEl));
  }

  /**
   * getCurrentItem returns the current edited element
   */
  getCurrentItem(event: Event) {
    let currentEditItemEl = this.#getElementFromEvent(event);

    const isInZoneEditEl = this.#isInZoneEditEl(currentEditItemEl);
    if (!isInZoneEditEl) {
      this.setInactiveLastEditItem();
      return null;
    }

    const fromInnerEditEl = this.#getFromInnerOrSelfEditEl(currentEditItemEl);
    if (fromInnerEditEl) {
      currentEditItemEl = fromInnerEditEl;
    }

    if (!currentEditItemEl) {
      throw new Error(`Could not found ${CDK_EDIT_CSS_CLASS} element!`);
    }

    return currentEditItemEl;
  }

  /**
   * setInactiveLastEditItem sets the last edited element inactive
   */
  setInactiveLastEditItem() {
    this.#lastEditItemRef?.inactiveEdit();
    this.#lastEditItemEl = undefined;
  }

  /** @private */
  #storeLastEditItem(element: Element) {
    this.#lastEditItemEl = element;
    this.#lastEditItemRef = this.getEditItem(element);
  }

  /** @private */
  #isInZoneEditEl(element: Element) {
    return !!this.#getFromInnerOrSelfEditEl(element);
  }

  /** @private */
  #getElementFromEvent(element: Event) {
    const _element = (element as unknown as _Event)?.target as Element;
    if (!_element) {
      throw new Error('Event.target does not contain HTMLElement');
    }
    return _element;
  }

  /** @private */
  #getFromInnerOrSelfEditEl(element: Element) {
    return element.closest<Element>(CDK_EDIT_CSS_CLASS);
  }
}
