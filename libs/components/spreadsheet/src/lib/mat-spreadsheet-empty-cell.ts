import { CdkSpreadsheetStorageDirective } from './cdk-spreadsheet-storage.directive';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  Injector,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  SPREADSHEET_STORAGE_PROVIDER,
  SPREADSHEET_STORAGE_TOKEN,
} from './cdk-spreadsheet-storage.factory';
import { ComponentPortal, Portal } from '@angular/cdk/portal';
import { CdkSpreadsheetRuleManager } from './cdk-spreadsheet-rule.manager';
import { ACTION_DATA } from './mat-spreadsheet-input';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mat-spreadsheet-empty-cell',
  providers: [SPREADSHEET_STORAGE_PROVIDER],
  template: '<ng-template [cdkPortalOutlet]="actionPortal"></ng-template>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatSpreadsheetEmptyCellComponent<Item> implements AfterViewInit {
  constructor(
    @Inject(SPREADSHEET_STORAGE_TOKEN)
    private readonly _storage: CdkSpreadsheetStorageDirective<Item>,
    private readonly _ruleManager: CdkSpreadsheetRuleManager<Item>,
    private readonly _injector: Injector,
    private readonly _cdr: ChangeDetectorRef,
  ) {}

  actionPortal!: Portal<any>;
  componentPortal!: ComponentPortal<unknown>;

  @HostBinding('class.mat-spreadsheet-empty-cell') hostClass = true;

  @Output() inputChange = new EventEmitter<string>();

  ngAfterViewInit() {
    const { item, key, actionType } = this._storage;
    const action = this._ruleManager.getActionRule(item, key, actionType);

    const componentType = action?.componentType;
    if (action && typeof componentType === 'function') {
      const actionDataInjector = Injector.create({
        parent: this._injector,
        providers: [{ provide: ACTION_DATA, useValue: action.data || null }],
      });

      this.actionPortal = new ComponentPortal(componentType, null, actionDataInjector);
      this._cdr.markForCheck();
      this._cdr.detectChanges();
    }
  }
}
