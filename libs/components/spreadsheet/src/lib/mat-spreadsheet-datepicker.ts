import { CdkSpreadsheetEditDirective } from './cdk-spreadsheet-edit.directive';
import { CdkSpreadsheetFormControlDirective } from './cdk-spreadsheet-form-control.directive';
import { CdkSpreadsheetCommonDirective } from './cdk-spreadsheet-common.directive';
import { CdkSpreadsheetStorageDirective } from './cdk-spreadsheet-storage.directive';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { SPREADSHEET_EDIT_PROVIDER, SPREADSHEET_EDIT_TOKEN } from './cdk-spreadsheet-edit.factory';
import {
  SPREADSHEET_FORM_CONTROL_PROVIDER,
  SPREADSHEET_FORM_CONTROL_TOKEN,
} from './cdk-spreadsheet-form-control.factory';
import {
  SPREADSHEET_COMMON_PROVIDER,
  SPREADSHEET_COMMON_TOKEN,
} from './cdk-spreadsheet-common.factory';
import {
  SPREADSHEET_STORAGE_PROVIDER,
  SPREADSHEET_STORAGE_TOKEN,
} from './cdk-spreadsheet-storage.factory';
import { CdkSpreadsheetDateAdapter } from './cdk-spreadsheet-date.adapter';
import { Moment } from 'moment/moment';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mat-spreadsheet-datepicker',
  providers: [
    SPREADSHEET_COMMON_PROVIDER,
    SPREADSHEET_EDIT_PROVIDER,
    SPREADSHEET_FORM_CONTROL_PROVIDER,
    SPREADSHEET_STORAGE_PROVIDER,
  ],
  template: `
    <ng-container
      *ngIf="(_edit.active$ | async) === true && !_formControl.disabled; else defaultTemplate"
    >
      <form
        novalidate
        [formGroup]="_formControl.formControlGroup"
        (ngSubmit)="_dateChange(matDatepicker.value); _formControl.errors && tooltip.show()"
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
            #matDatepicker="matDatepickerInput"
            [placeholder]="_storage.placeholder"
            [formControlName]="_formControl.formControlName"
            [matDatepicker]="picker"
            (dateChange)="_dateChange(matDatepicker.value); picker.close()"
            [type]="_common.type"
            [autocomplete]="_common.autocomplete"
          />
          <mat-error *ngIf="_formControl.errors"></mat-error>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
      </form>
    </ng-container>
    <ng-template #defaultTemplate>
      <div
        [title]="_dateRender"
        class="cdk-default-field"
        [ngClass]="{ disabled: _formControl.disabled, 'mat-red-500': _formControl.errors }"
      >
        <span>{{ _dateRender || _storage.placeholder }}</span>
      </div>
    </ng-template>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatSpreadsheetDatepickerComponent<Item> {
  constructor(
    private readonly _dateAdapter: CdkSpreadsheetDateAdapter,
    @Inject(SPREADSHEET_COMMON_TOKEN)
    public readonly _common: CdkSpreadsheetCommonDirective,
    @Inject(SPREADSHEET_EDIT_TOKEN)
    public readonly _edit: CdkSpreadsheetEditDirective,
    @Inject(SPREADSHEET_FORM_CONTROL_TOKEN)
    public readonly _formControl: CdkSpreadsheetFormControlDirective<Item>,
    @Inject(SPREADSHEET_STORAGE_TOKEN)
    public readonly _storage: CdkSpreadsheetStorageDirective<Item>,
  ) {}

  @HostBinding('class.mat-spreadsheet-datepicker') hostClass = true;

  @Output() dateChange = new EventEmitter<Date | string>();

  /** @internal */
  _displayDateInput = this._dateAdapter.matDateFormats.display.dateInput;

  /** @internal */
  _formatDateInput = this._dateAdapter.matFormatDateInput;

  /** @internal */
  get _controlValue() {
    return this._formControl?.value;
  }

  /** @internal */
  get _dateRender() {
    return this._dateAdapter.format(this._controlValue, this._displayDateInput);
  }

  /** @internal */
  _dateValue(value: Date | Moment | string | unknown) {
    return this._dateAdapter.format(value, this._formatDateInput);
  }

  /** @internal */
  _dateChange(value: unknown) {
    if (value === null) return;

    this._storage.setValue(this._dateValue(value));
    this.dateChange.emit(value as Date | string);
  }
}
