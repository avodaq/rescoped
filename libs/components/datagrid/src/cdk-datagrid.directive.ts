import {
  CdkDatagridDataManager,
  GlobalRules,
  ItemActionIndex,
  ItemActionType,
  ValueChange,
} from './cdk-datagrid-data.manager';
import { CdkDatagridEditManager } from './cdk-datagrid-edit.manager';
import {
  ChangeDetectorRef,
  Directive,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CdkDatagridRuleManager } from './cdk-datagrid-rule.manager';
import { setItemPayload } from './cdk-datagrid.utils';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

// MDC
import { MatTableDataSource } from '@angular/material/table';

export type Density = 'xs' | 'sm' | 'md' | 'lg';
export type CellGap = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'cdk-table[cdk-datagrid]',
  exportAs: 'cdkDatagrid',
  standalone: true,
})
export class CdkDatagridDirective<Item> implements OnInit, OnDestroy {
  constructor(
    private readonly _cdr: ChangeDetectorRef,
    private readonly _dataManager: CdkDatagridDataManager<Item>,
    private readonly _ruleManager: CdkDatagridRuleManager<Item>,
    private readonly _editManager: CdkDatagridEditManager<HTMLElement>,
  ) {}

  #unsub = new Subject<void>();

  get countSingleItems() {
    return this._dataManager.countSingleItems;
  }

  get countGroupItems() {
    return this._dataManager.countGroupItems;
  }

  get items() {
    return this._dataManager.data;
  }

  get inCellZone() {
    return this._editManager.inCellZone;
  }

  @Output() readonly valueChange = this._dataManager.valueChange$;

  currentValueChange: ValueChange | null = null;
  readonly #valueChange = this._dataManager.valueChange$.pipe(
    tap(valueChange => (this.currentValueChange = valueChange)),
    tap(() => this._cdr.markForCheck()),
  );

  @HostBinding('class.cdk-datagrid') hostClass = true;

  // @todo: implement this!!!!
  @Input() density: Density = 'xs';
  @Input() rowHover = true;
  @Input() collapsedRows = true;
  @Input() cellGap: CellGap = 2;
  @Input() rowGrouping = false;
  @Input() groupDesign: 'bm' | '' = '';

  @Input() dataSource!: TableVirtualScrollDataSource<Item> | MatTableDataSource<Item>;
  @Input() set itemRules(rules: GlobalRules<Item>) {
    this._ruleManager.setGlobalRules(rules);
  }

  // on click outside of datagrid, the last edited item will be inactivated.
  // @todo: this breaks the skygrid! Dont know why. But we dont need this because
  // setting the last item inactive will be made bey see @HostListener('click', ['$event']) click(e: MouseEvent
  // @HostListener('document:click', ['$event']) documentClick(e: MouseEvent) {
  //   if (!this._editManager.isInZoneEditItem(e)) {
  //     this._editManager.setInactiveLastEditItem();
  //   }
  // }

  @HostListener('click', ['$event']) click(e: MouseEvent) {
    this._editManager.setActiveEditItem(e);
  }

  @HostListener('keydown.tab', ['$event']) tab(e: KeyboardEvent) {
    this._editManager.setInactiveLastEditItem();
    e.preventDefault(); // @todo: remove this later when keyboard navigation is implemented!
  }

  @HostListener('keyup.esc', ['$event']) esc(e: KeyboardEvent) {
    // console.log('keyup.esc', e);
  }

  @HostListener('keydown', ['$event']) arrowKey(e: KeyboardEvent) {
    // console.log('keydown', e);
  }

  @HostListener('keydown.enter', ['$event']) enter(e: KeyboardEvent) {
    // console.log('keydown.enter', e);
  }

  @HostListener('keydown.shift.enter', ['$event']) shiftEnter(e: KeyboardEvent) {
    // console.log('keydown.shift.enter', e);
  }

  @HostListener('keydown.shift.tab', ['$event']) shiftTab(e: KeyboardEvent) {
    // console.log('keydown.shift.tab', e);
  }

  setValue<ItemKey extends keyof Item>(
    key: ItemKey,
    value: Item[ItemKey],
    actionType: ItemActionType,
    where: 'dataSource' | 'formSource' = 'dataSource',
  ) {
    const item = setItemPayload({}, { actionType }) as Item;
    if (where === 'dataSource') {
      this._dataManager.setValue(key, value, item);
    }
  }

  setValueChange(valueChange: ValueChange | null) {
    this._dataManager.setValueChange(valueChange);
  }

  /**
   * This method is useful when you want to add dynamic a runtime an item to the table.
   */
  activeMetaRow(active: boolean, actionType: ItemActionType) {
    this._dataManager.addDataSlotItem({
      index: ItemActionIndex.rowGlobal,
      id: actionType,
      active,
      actionType,
    });
  }

  ngOnInit() {
    this._dataManager.dataSource = this.dataSource as MatTableDataSource<Item>;
    this.#valueChange.pipe(takeUntil(this.#unsub)).subscribe();
  }

  ngOnDestroy() {
    this.#unsub.next();
    this.#unsub.complete();
    this._dataManager.destroy();
  }
}
