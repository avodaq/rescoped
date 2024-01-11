// MDC
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteModule,
} from '@angular/material/autocomplete';

import { CdkDatagridEditDirective } from './cdk-datagrid-edit.directive';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { DATAGRID_EDIT_PROVIDER, DATAGRID_EDIT_TOKEN } from './cdk-datagrid-edit.factory';
import {
  DATAGRID_FORM_CONTROL_PROVIDER,
  DATAGRID_FORM_CONTROL_TOKEN,
} from './cdk-datagrid-form-control.factory';
import { CdkDatagridFormControlDirective } from './cdk-datagrid-form-control.directive';
import { merge, of, Subject } from 'rxjs';
import { debounceTime, mergeMap, startWith } from 'rxjs/operators';
import { DATAGRID_COMMON_PROVIDER, DATAGRID_COMMON_TOKEN } from './cdk-datagrid-common.factory';
import { CdkDatagridCommonDirective } from './cdk-datagrid-common.directive';
import { DATAGRID_STORAGE_PROVIDER, DATAGRID_STORAGE_TOKEN } from './cdk-datagrid-storage.factory';
import { CdkDatagridStorageDirective } from './cdk-datagrid-storage.directive';
import { ThemePalette, MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CdkDatagridFocusComboboxDirective } from './mat-datagrid-focus.directives';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mat-datagrid-combobox',
  providers: [
    DATAGRID_COMMON_PROVIDER,
    DATAGRID_EDIT_PROVIDER,
    DATAGRID_FORM_CONTROL_PROVIDER,
    DATAGRID_STORAGE_PROVIDER,
  ],
  template: `
    <ng-container
      *ngIf="(_edit.active$ | async) === true && !_formControl.disabled; else defaultTemplate"
    >
      <form
        novalidate
        [formGroup]="_formControl.formControlGroup"
        (keydown.enter)="$event.preventDefault()"
        (ngSubmit)="_addSelection(input.value)"
      >
        <mat-form-field
          [appearance]="'outline'"
          #tooltip="matTooltip"
          [matTooltip]="_formControl.errors?.validationMessage"
          [matTooltipPosition]="'above'"
          [matTooltipDisabled]="!_formControl.errors"
          [matTooltipShowDelay]="0"
          [matTooltipHideDelay]="0"
        >
          <input
            matInput
            cdkFocusCombobox
            #input
            [placeholder]="_storage.placeholder"
            (keyup)="_search$.next(input.value)"
            [formControlName]="_formControl.formControlName"
            [title]="_renderForDefaultView"
            [matAutocomplete]="auto"
            [autocomplete]="autocomplete"
            [type]="_common.type"
          />
          <mat-error *ngIf="_formControl.errors"></mat-error>
          <button
            matSuffix
            mat-icon-button
            aria-label="add item button"
            class="add-item-icon"
            *ngIf="selectionAdd"
            (click)="_addSelection(input.value.trim()); input.value = ''"
            [color]="selectionAddIconColor"
          >
            <mat-icon>{{ selectionAddIcon }}</mat-icon>
          </button>

          <mat-autocomplete
            #auto="matAutocomplete"
            [panelWidth]="'auto'"
            [displayWith]="_displayForAutoCompleteOption.bind(this)"
            (optionSelected)="
              _selectionChange($event); input.blur(); _formControl.errors && tooltip.show()
            "
          >
            <mat-option *ngFor="let option of _filteredOptions$ | async" [value]="option">
              <div>{{ option[this._storage.renderKey] }}</div>
            </mat-option>
          </mat-autocomplete>
        </mat-form-field>
      </form>
    </ng-container>
    <ng-template #defaultTemplate>
      <div
        [title]="_renderForDefaultView"
        class="cdk-default-field"
        [ngClass]="{
          disabled: _formControl.disabled,
          'mat-red-500 mat-error': _formControl.errors
        }"
      >
        <span>{{ _renderForDefaultView || _storage.placeholder }}</span>
      </div>
    </ng-template>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatInputModule,
    MatAutocompleteModule,
    CdkDatagridFocusComboboxDirective,
    MatButtonModule,
    MatIconModule,
    NgFor,
    MatOptionModule,
    NgClass,
    AsyncPipe,
  ],
})
export class MatDatagridComboboxComponent<Item> {
  constructor(
    @Inject(DATAGRID_COMMON_TOKEN)
    public readonly _common: CdkDatagridCommonDirective,
    @Inject(DATAGRID_EDIT_TOKEN)
    public readonly _edit: CdkDatagridEditDirective,
    @Inject(DATAGRID_FORM_CONTROL_TOKEN)
    public readonly _formControl: CdkDatagridFormControlDirective<Item>,
    @Inject(DATAGRID_STORAGE_TOKEN)
    public readonly _storage: CdkDatagridStorageDirective<Item>,
  ) {}

  @HostBinding('class.mat-datagrid-combobox') hostClass = true;

  @Input() options!: Item[];
  // @Input() options!: Options[];

  @Output() selectionChange = new EventEmitter<MatAutocompleteSelectedEvent>();
  @Output() selectionAdded = new EventEmitter<string>();

  @Input() selectionAdd = false;
  @Input() selectionAddIcon = 'add';
  @Input() selectionAddIconColor: ThemePalette = 'primary';

  /** @internal */
  _search$ = new Subject<string>();

  /** @internal */
  _addedOption$ = new Subject<Item[]>();

  /** @internal */
  _filteredOptions$ = this._search$.pipe(
    startWith(''),
    debounceTime(300),
    mergeMap(search => merge(of(this._filterOptions(search)), this._addedOption$)),
  );

  @Input() get autocomplete() {
    return this._common.autocomplete as unknown as string;
  }

  /** @internal */
  _selectChange!: Item;

  /** @internal */
  _selectionChange(change: MatAutocompleteSelectedEvent) {
    this._selectChange = change.option.value as Item;

    this._storage.setValue(this._selectChange);
    this.selectionChange.emit(change);
  }

  /** @internal */
  _addSelection(value: string) {
    if (!value) return;

    this._addedOption$.next([{ [this._storage.key]: value }] as unknown as Item[]);
    this.selectionAdded.emit(value);
  }

  /** @internal */
  _displayForAutoCompleteOption(option: Item) {
    return option?.[this._storage.renderKey] as unknown as string;
  }

  /** @internal */
  get _renderForDefaultView() {
    const value = this._formControl?.value?.[this._storage.renderKey];
    return value ? value : this._formControl?.value || '';
  }

  /** @internal */
  _filterOptions(search: string) {
    return (
      this.options?.filter(option =>
        (option[this._storage.renderKey] as unknown as string)
          .toLowerCase()
          .includes(search.toLowerCase()),
      ) || []
    );
  }
}
