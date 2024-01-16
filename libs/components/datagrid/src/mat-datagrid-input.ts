import { CdkDatagridFormControlDirective } from './cdk-datagrid-form-control.directive';
import { CdkDatagridEditDirective } from './cdk-datagrid-edit.directive';
import { DATAGRID_COMMON_PROVIDER, DATAGRID_COMMON_TOKEN } from './cdk-datagrid-common.factory';
import { CdkDatagridCommonDirective } from './cdk-datagrid-common.directive';
import { DATAGRID_EDIT_PROVIDER, DATAGRID_EDIT_TOKEN } from './cdk-datagrid-edit.factory';
import { CdkDatagridStorageDirective } from './cdk-datagrid-storage.directive';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  InjectionToken,
  Injector,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  DATAGRID_FORM_CONTROL_PROVIDER,
  DATAGRID_FORM_CONTROL_TOKEN,
} from './cdk-datagrid-form-control.factory';
import { DATAGRID_STORAGE_PROVIDER, DATAGRID_STORAGE_TOKEN } from './cdk-datagrid-storage.factory';
import { ComponentPortal, Portal, PortalModule } from '@angular/cdk/portal';
import { CdkDatagridRuleManager } from './cdk-datagrid-rule.manager';
import { getItemPayload } from './cdk-datagrid.utils';
import { CdkDatagridFocusInputDirective } from './mat-datagrid-focus.directives';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass, AsyncPipe } from '@angular/common';

// @todo: move to separate file!
export const ACTION_DATA = new InjectionToken<unknown>('ActionData');

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mat-datagrid-input',
  exportAs: 'matDatagridInput',
  providers: [
    DATAGRID_COMMON_PROVIDER,
    DATAGRID_EDIT_PROVIDER,
    DATAGRID_FORM_CONTROL_PROVIDER,
    DATAGRID_STORAGE_PROVIDER,
  ],
  template: `
    <ng-template [cdkPortalOutlet]="beforeActionPortal"></ng-template>
    @if (!override) {
      @if ((_edit.active$ | async) === true && !_formControl.disabled) {
        <form
          novalidate
          [formGroup]="_formControl.formControlGroup"
          (ngSubmit)="_inputChange(input.value); _formControl.errors && tooltip.show()"
        >
          <mat-form-field
            appearance="outline"
            #tooltip="matTooltip"
            [matTooltip]="_formControl.errors?.validationMessage"
            [matTooltipPosition]="'above'"
            [matTooltipDisabled]="!_formControl.errors"
            [matTooltipShowDelay]="0"
            [matTooltipHideDelay]="0"
          >
            <input
              matInput
              cdkFocusInput
              #input
              [placeholder]="_storage.placeholder"
              [formControlName]="_formControl.formControlName"
              [type]="_common.type"
              [autocomplete]="_common.autocomplete"
            />
            @if (_formControl.errors) {
              <mat-error></mat-error>
            }
          </mat-form-field>
        </form>
      } @else {
        <div
          [title]="_formControl.value"
          class="cdk-default-field"
          [ngClass]="{
            disabled: _formControl.disabled,
            'mat-red-500 mat-error': _formControl.errors
          }"
        >
          <span>{{ _formControl.value || _storage.placeholder }}</span>
        </div>
      }
    }
    <ng-template [cdkPortalOutlet]="afterActionPortal"></ng-template>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    PortalModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatInputModule,
    CdkDatagridFocusInputDirective,
    NgClass,
    AsyncPipe,
  ],
})
export class MatDatagridInputComponent<Item> implements OnInit {
  constructor(
    @Inject(DATAGRID_COMMON_TOKEN)
    public readonly _common: CdkDatagridCommonDirective,
    @Inject(DATAGRID_EDIT_TOKEN)
    public readonly _edit: CdkDatagridEditDirective,
    @Inject(DATAGRID_FORM_CONTROL_TOKEN)
    public readonly _formControl: CdkDatagridFormControlDirective<Item>,
    @Inject(DATAGRID_STORAGE_TOKEN)
    public readonly _storage: CdkDatagridStorageDirective<Item>,

    private readonly _cdr: ChangeDetectorRef,
    private readonly _injector: Injector,
    private readonly _ruleManager: CdkDatagridRuleManager<Item>,
  ) {}

  index!: number;
  override = false;
  afterActionPortal!: Portal<any>;
  beforeActionPortal!: Portal<any>;
  componentPortal!: ComponentPortal<unknown>;

  @HostBinding('class.mat-datagrid-input') hostClass = true;

  @Output() inputChange = new EventEmitter<string>();

  // @todo: everything have to be moved to a directive
  // - have CdkDatagridActionDirective but works not well because have to trigger

  ngOnInit() {
    const { item, key } = this._storage;
    const actionType = getItemPayload(item).actionType;
    const action = this._ruleManager.getActionRule(item, key, actionType);

    const componentType = action?.componentType;
    const componentPosition = action?.componentPosition;

    if (action && typeof componentType === 'function') {
      const actionDataInjector = Injector.create({
        parent: this._injector,
        providers: [{ provide: ACTION_DATA, useValue: action.data || null }],
      });

      if (typeof componentPosition === 'string' && componentPosition === 'before') {
        this.beforeActionPortal = new ComponentPortal(componentType, null, actionDataInjector);
      } else if (typeof componentPosition === 'string' && componentPosition === 'after') {
        this.afterActionPortal = new ComponentPortal(componentType, null, actionDataInjector);
      } else {
        this.override = true;
        this.beforeActionPortal = new ComponentPortal(componentType, null, actionDataInjector);
      }

      this._cdr.markForCheck();
      this._cdr.detectChanges();
    }
  }

  /** @internal */
  _inputChange(value: string) {
    this._storage.setValue(value); // @todo: when input type is number then convert to number
    this.inputChange.emit(value);
  }
}

export const MAT_FORMAT_INPUT = new InjectionToken<DatagridInputFormats>('matInputFormats');
export const MAT_NUMBER_INPUT = new InjectionToken<DatagridInputFormats>('matInputNumbers');

export interface DatagridInputFormatsTypes {
  parse?: RegExp;
  display?: RegExp;
}

export interface DatagridInputNumbersTypes {
  round?: number | ((value: number) => number);
}

export interface DatagridInputFormats<Item = unknown> extends DatagridInputFormatsTypes {
  overrides?: {
    [itemKey in keyof Item]?: DatagridInputFormatsTypes;
  };
}

export interface DatagridInputNumbers<Item = unknown> extends DatagridInputNumbersTypes {
  overrides?: {
    [itemKey in keyof Item]?: DatagridInputFormatsTypes;
  };
}
