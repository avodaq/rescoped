import { CdkDatagridEditDirective } from './cdk-datagrid-edit.directive';
import { CdkDatagridFormControlDirective } from './cdk-datagrid-form-control.directive';
import { CdkDatagridCommonDirective } from './cdk-datagrid-common.directive';
import { CdkDatagridStorageDirective } from './cdk-datagrid-storage.directive';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { DATAGRID_EDIT_PROVIDER, DATAGRID_EDIT_TOKEN } from './cdk-datagrid-edit.factory';
import {
  DATAGRID_FORM_CONTROL_PROVIDER,
  DATAGRID_FORM_CONTROL_TOKEN,
} from './cdk-datagrid-form-control.factory';
import { DATAGRID_COMMON_PROVIDER, DATAGRID_COMMON_TOKEN } from './cdk-datagrid-common.factory';
import { DATAGRID_STORAGE_PROVIDER, DATAGRID_STORAGE_TOKEN } from './cdk-datagrid-storage.factory';
import { CdkDatagridDateAdapter } from './cdk-datagrid-date.adapter';
import { Moment } from 'moment/moment';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CdkDatagridFocusInputDirective } from './mat-datagrid-focus.directives';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass, AsyncPipe } from '@angular/common';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mat-datagrid-datepicker',
  providers: [
    DATAGRID_COMMON_PROVIDER,
    DATAGRID_EDIT_PROVIDER,
    DATAGRID_FORM_CONTROL_PROVIDER,
    DATAGRID_STORAGE_PROVIDER,
  ],
  template: `
    @if ((_edit.active$ | async) === true && !_formControl.disabled) {
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
          @if (_formControl.errors) {
            <mat-error></mat-error>
          }
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
      </form>
    } @else {
      <div
        [title]="_dateRender"
        class="cdk-default-field"
        [ngClass]="{
          disabled: _formControl.disabled,
          'mat-red-500 mat-error': _formControl.errors
        }"
      >
        <span>{{ _dateRender || _storage.placeholder }}</span>
      </div>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatInputModule,
    CdkDatagridFocusInputDirective,
    MatDatepickerModule,
    NgClass,
    AsyncPipe,
  ],
})
export class MatDatagridDatepickerComponent<Item> {
  constructor(
    private readonly _dateAdapter: CdkDatagridDateAdapter,
    @Inject(DATAGRID_COMMON_TOKEN)
    public readonly _common: CdkDatagridCommonDirective,
    @Inject(DATAGRID_EDIT_TOKEN)
    public readonly _edit: CdkDatagridEditDirective,
    @Inject(DATAGRID_FORM_CONTROL_TOKEN)
    public readonly _formControl: CdkDatagridFormControlDirective<Item>,
    @Inject(DATAGRID_STORAGE_TOKEN)
    public readonly _storage: CdkDatagridStorageDirective<Item>,
  ) {}

  @HostBinding('class.mat-datagrid-datepicker') hostClass = true;

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
