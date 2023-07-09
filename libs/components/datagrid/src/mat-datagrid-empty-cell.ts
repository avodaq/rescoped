import { CdkDatagridStorageDirective } from './cdk-datagrid-storage.directive';
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
import { DATAGRID_STORAGE_PROVIDER, DATAGRID_STORAGE_TOKEN } from './cdk-datagrid-storage.factory';
import { ComponentPortal, Portal, PortalModule } from '@angular/cdk/portal';
import { CdkDatagridRuleManager } from './cdk-datagrid-rule.manager';
import { ACTION_DATA } from './mat-datagrid-input';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mat-datagrid-empty-cell',
  providers: [DATAGRID_STORAGE_PROVIDER],
  template: '<ng-template [cdkPortalOutlet]="actionPortal"></ng-template>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PortalModule],
})
export class MatDatagridEmptyCellComponent<Item> implements AfterViewInit {
  constructor(
    @Inject(DATAGRID_STORAGE_TOKEN)
    private readonly _storage: CdkDatagridStorageDirective<Item>,
    private readonly _ruleManager: CdkDatagridRuleManager<Item>,
    private readonly _injector: Injector,
    private readonly _cdr: ChangeDetectorRef,
  ) {}

  actionPortal!: Portal<any>;
  componentPortal!: ComponentPortal<unknown>;

  @HostBinding('class.mat-datagrid-empty-cell') hostClass = true;

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
