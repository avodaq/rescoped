import { CdkSpreadsheetFormControlDirective } from './cdk-spreadsheet-form-control.directive';
import { CdkSpreadsheetEditDirective } from './cdk-spreadsheet-edit.directive';
import {
  SPREADSHEET_COMMON_PROVIDER,
  SPREADSHEET_COMMON_TOKEN,
} from './cdk-spreadsheet-common.factory';
import { CdkSpreadsheetCommonDirective } from './cdk-spreadsheet-common.directive';
import { SPREADSHEET_EDIT_PROVIDER, SPREADSHEET_EDIT_TOKEN } from './cdk-spreadsheet-edit.factory';
import { CdkSpreadsheetStorageDirective } from './cdk-spreadsheet-storage.directive';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  InjectionToken,
  Injector,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  SPREADSHEET_FORM_CONTROL_PROVIDER,
  SPREADSHEET_FORM_CONTROL_TOKEN,
} from './cdk-spreadsheet-form-control.factory';
import {
  SPREADSHEET_STORAGE_PROVIDER,
  SPREADSHEET_STORAGE_TOKEN,
} from './cdk-spreadsheet-storage.factory';
import { ComponentPortal, Portal } from '@angular/cdk/portal';
import { CdkSpreadsheetRuleManager } from './cdk-spreadsheet-rule.manager';
import { getItemPayload } from './cdk-spreadsheet.utils';

// @todo: move to separate file!
export const ACTION_DATA = new InjectionToken<unknown>('ActionData');

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mat-spreadsheet-input',
  exportAs: 'matSpreadsheetInput',
  providers: [
    SPREADSHEET_COMMON_PROVIDER,
    SPREADSHEET_EDIT_PROVIDER,
    SPREADSHEET_FORM_CONTROL_PROVIDER,
    SPREADSHEET_STORAGE_PROVIDER,
  ],
  template: `
    <ng-template [cdkPortalOutlet]="beforeActionPortal"></ng-template>
    <ng-container *ngIf="!override">
      <ng-container
        *ngIf="(_edit.active$ | async) === true && !_formControl.disabled; else defaultTemplate"
      >
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
            <mat-error *ngIf="_formControl.errors"></mat-error>
          </mat-form-field>
        </form>
      </ng-container>
      <ng-template #defaultTemplate>
        <div
          [title]="_formControl.value"
          class="cdk-default-field"
          [ngClass]="{ disabled: _formControl.disabled, 'mat-red-500': _formControl.errors }"
        >
          <span>{{ _formControl.value || _storage.placeholder }}</span>
        </div>
      </ng-template>
    </ng-container>
    <ng-template [cdkPortalOutlet]="afterActionPortal"></ng-template>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatSpreadsheetInputComponent<Item> implements AfterViewInit {
  constructor(
    @Inject(SPREADSHEET_COMMON_TOKEN)
    public readonly _common: CdkSpreadsheetCommonDirective,
    @Inject(SPREADSHEET_EDIT_TOKEN)
    public readonly _edit: CdkSpreadsheetEditDirective,
    @Inject(SPREADSHEET_FORM_CONTROL_TOKEN)
    public readonly _formControl: CdkSpreadsheetFormControlDirective<Item>,
    @Inject(SPREADSHEET_STORAGE_TOKEN)
    public readonly _storage: CdkSpreadsheetStorageDirective<Item>,

    private readonly _cdr: ChangeDetectorRef,
    private readonly _injector: Injector,
    private readonly _ruleManager: CdkSpreadsheetRuleManager<Item>,
  ) {}

  override = false;
  afterActionPortal!: Portal<any>;
  beforeActionPortal!: Portal<any>;
  componentPortal!: ComponentPortal<unknown>;

  @HostBinding('class.mat-spreadsheet-input') hostClass = true;

  @Output() inputChange = new EventEmitter<string>();

  // @todo: everything have to be moved to a directive
  // - have CdkSpreadsheetActionDirective but works not well because have to trigger
  ngAfterViewInit() {
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

export const MAT_FORMAT_INPUT = new InjectionToken<SpreadsheetInputFormats>('matInputFormats');
export const MAT_NUMBER_INPUT = new InjectionToken<SpreadsheetInputFormats>('matInputNumbers');

export interface SpreadsheetInputFormatsTypes {
  parse?: RegExp;
  display?: RegExp;
}

export interface SpreadsheetInputNumbersTypes {
  round?: number | ((value: number) => number);
}

export interface SpreadsheetInputFormats<Item = unknown> extends SpreadsheetInputFormatsTypes {
  overrides?: {
    [itemKey in keyof Item]?: SpreadsheetInputFormatsTypes;
  };
}

export interface SpreadsheetInputNumbers<Item = unknown> extends SpreadsheetInputNumbersTypes {
  overrides?: {
    [itemKey in keyof Item]?: SpreadsheetInputFormatsTypes;
  };
}
