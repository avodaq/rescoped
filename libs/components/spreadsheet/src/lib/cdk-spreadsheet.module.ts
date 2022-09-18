import { MatSpreadsheetDirective } from './mat-spreadsheet.directive';
import { CdkSpreadsheetDirective } from './cdk-spreadsheet.directive';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSpreadsheetComboboxComponent } from './mat-spreadsheet-combobox';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_FORMAT_INPUT,
  MAT_NUMBER_INPUT,
  MatSpreadsheetInputComponent,
  SpreadsheetInputFormats,
  SpreadsheetInputNumbers,
} from './mat-spreadsheet-input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSpreadsheetCollapseComponent } from './mat-spreadsheet-collapse';
import { CdkSpreadsheetCollapseComponent } from './cdk-spreadsheet-collapse';
import { MatButtonModule } from '@angular/material/button';
import { CdkSpreadsheetFormControlDirective } from './cdk-spreadsheet-form-control.directive';
import { CdkSpreadsheetEditDirective } from './cdk-spreadsheet-edit.directive';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PartialDeep } from './cdk-spreadsheet.types';
import { LOCALE_ID, ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { CdkSpreadsheetCommonDirective } from './cdk-spreadsheet-common.directive';
import { CdkSpreadsheetStorageDirective } from './cdk-spreadsheet-storage.directive';
import { MatSpreadsheetDatepickerComponent } from './mat-spreadsheet-datepicker';
import {
  CdkSpreadsheetDateAdapter,
  MAT_DATE_CLASS,
  matDateFormatsDefaults,
} from './cdk-spreadsheet-date.adapter';
import { MatSpreadsheetRowDirective } from './mat-spreadsheet-row.directive';
import { TypeSafeMatCellDefDirective } from './type-safe-mat-cell-def.directive';
import { CdkSpreadsheetConnectWithDirective } from './cdk-spreadsheet-connect-with.directive';
import deepmerge from 'deepmerge';
import moment from 'moment';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  CdkSpreadsheetFocusComboboxDirective,
  CdkSpreadsheetFocusInputDirective,
} from './mat-spreadsheet-focus.directives';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  MatDateFormats,
} from '@angular/material/core';
import { PortalModule } from '@angular/cdk/portal';
import { MatSpreadsheetEmptyCellComponent } from './mat-spreadsheet-empty-cell';
import { CdkSpreadsheetRuleManager } from './cdk-spreadsheet-rule.manager';
import { CdkSpreadsheetEditManager } from './cdk-spreadsheet-edit.manager';
import { CdkSpreadsheetFormManager } from './cdk-spreadsheet-form.manager';
import { CdkSpreadsheetDataManager } from './cdk-spreadsheet-data.manager';

const SPREADSHEET_CORE_DEPS = [
  CdkSpreadsheetDirective,
  CdkSpreadsheetCollapseComponent,
  CdkSpreadsheetFormControlDirective,
  CdkSpreadsheetEditDirective,
  CdkSpreadsheetCommonDirective,
  CdkSpreadsheetStorageDirective,
  CdkSpreadsheetFocusInputDirective,
  CdkSpreadsheetFocusComboboxDirective,
  CdkSpreadsheetConnectWithDirective,
  MatSpreadsheetDirective,
  MatSpreadsheetComboboxComponent,
  MatSpreadsheetDatepickerComponent,
  MatSpreadsheetInputComponent,
  MatSpreadsheetCollapseComponent,
  MatSpreadsheetRowDirective,
  MatSpreadsheetEmptyCellComponent,
  TypeSafeMatCellDefDirective,
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    ScrollingModule,
    PortalModule,
  ],
  declarations: [...SPREADSHEET_CORE_DEPS],
  exports: [...SPREADSHEET_CORE_DEPS],
})
export class CdkSpreadsheetModule {
  static forRoot<Item = unknown>(
    options: SpreadsheetOptions<Item>,
  ): ModuleWithProviders<CdkSpreadsheetModule> {
    const optionDateFormats = options?.datepicker?.formats || {};
    const optionInputFormats = options?.input?.formats || {};
    const optionInputNumbers = options?.input?.numbers || {};
    // @todo: use https://developer.mozilla.org/en-US/docs/Web/API/structuredClone insteadof deepmerge
    const _matDateFormatsDefaults = deepmerge(matDateFormatsDefaults, optionDateFormats);
    _matDateFormatsDefaults.parse.dateInput = optionDateFormats?.display?.dateInput || 'YYYY-MM-DD';

    return {
      ngModule: CdkSpreadsheetModule,
      providers: [
        CdkSpreadsheetFormManager,
        CdkSpreadsheetRuleManager,
        CdkSpreadsheetDataManager,
        CdkSpreadsheetDateAdapter,
        CdkSpreadsheetEditManager,
        {
          provide: DateAdapter,
          useClass: MomentDateAdapter,
          deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
        { provide: MAT_FORMAT_INPUT, useValue: optionInputFormats },
        { provide: MAT_NUMBER_INPUT, useValue: optionInputNumbers },
        { provide: MAT_DATE_FORMATS, useValue: _matDateFormatsDefaults },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        { provide: LOCALE_ID, useValue: 'en-GB' },
        { provide: MAT_DATE_CLASS, useValue: moment },
        { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
        ...(options?.datepicker?.providers || []),
      ],
    };
  }
}

export type SpreadsheetOptions<Item = unknown> = {
  datepicker?: {
    providers?: Provider[];
    formats?: PartialDeep<MatDateFormats>;
  };
  input?: {
    // @see: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
    formats?: SpreadsheetInputFormats<Item>;
    numbers?: SpreadsheetInputNumbers<Item>;
  };
};
