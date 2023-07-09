import { MatDatagridDirective } from './mat-datagrid.directive';
import { CdkDatagridDirective } from './cdk-datagrid.directive';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatagridComboboxComponent } from './mat-datagrid-combobox';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_FORMAT_INPUT,
  MAT_NUMBER_INPUT,
  MatDatagridInputComponent,
  DatagridInputFormats,
  DatagridInputNumbers,
} from './mat-datagrid-input';
import { MatDatagridCollapseComponent } from './mat-datagrid-collapse';
import { CdkDatagridCollapseComponent } from './cdk-datagrid-collapse';

//MDC
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';

import { CdkDatagridFormControlDirective } from './cdk-datagrid-form-control.directive';
import { CdkDatagridEditDirective } from './cdk-datagrid-edit.directive';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PartialDeep } from './cdk-datagrid.types';
import { LOCALE_ID, ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { CdkDatagridCommonDirective } from './cdk-datagrid-common.directive';
import { CdkDatagridStorageDirective } from './cdk-datagrid-storage.directive';
import { MatDatagridDatepickerComponent } from './mat-datagrid-datepicker';
import {
  CdkDatagridDateAdapter,
  MAT_DATE_CLASS,
  matDateFormatsDefaults,
} from './cdk-datagrid-date.adapter';
import { MatDatagridRowDirective } from './mat-datagrid-row.directive';
import { TypeSafeMatCellDefDirective } from './type-safe-mat-cell-def.directive';
import { CdkDatagridConnectWithDirective } from './cdk-datagrid-connect-with.directive';
import deepmerge from 'deepmerge';
import moment from 'moment';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  CdkDatagridFocusComboboxDirective,
  CdkDatagridFocusInputDirective,
} from './mat-datagrid-focus.directives';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  MatDateFormats,
} from '@angular/material/core';
import { PortalModule } from '@angular/cdk/portal';
import { MatDatagridEmptyCellComponent } from './mat-datagrid-empty-cell';
import { CdkDatagridRuleManager } from './cdk-datagrid-rule.manager';
import { CdkDatagridEditManager } from './cdk-datagrid-edit.manager';
import { CdkDatagridFormManager } from './cdk-datagrid-form.manager';
import { CdkDatagridDataManager } from './cdk-datagrid-data.manager';

const DATAGRID_CORE_DEPS = [
  CdkDatagridDirective,
  CdkDatagridCollapseComponent,
  CdkDatagridFormControlDirective,
  CdkDatagridEditDirective,
  CdkDatagridCommonDirective,
  CdkDatagridStorageDirective,
  CdkDatagridFocusInputDirective,
  CdkDatagridFocusComboboxDirective,
  CdkDatagridConnectWithDirective,
  MatDatagridDirective,
  MatDatagridComboboxComponent,
  MatDatagridDatepickerComponent,
  MatDatagridInputComponent,
  MatDatagridCollapseComponent,
  MatDatagridRowDirective,
  MatDatagridEmptyCellComponent,
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
    ...DATAGRID_CORE_DEPS,
  ],
  exports: [...DATAGRID_CORE_DEPS],
})
export class CdkDatagridModule {
  static forRoot<Item = unknown>(
    options: DatagridOptions<Item>,
  ): ModuleWithProviders<CdkDatagridModule> {
    const optionDateFormats = options?.datepicker?.formats || {};
    const optionInputFormats = options?.input?.formats || {};
    const optionInputNumbers = options?.input?.numbers || {};
    // @todo: use https://developer.mozilla.org/en-US/docs/Web/API/structuredClone insteadof deepmerge
    const _matDateFormatsDefaults = deepmerge(matDateFormatsDefaults, optionDateFormats);
    _matDateFormatsDefaults.parse.dateInput = optionDateFormats?.display?.dateInput || 'YYYY-MM-DD';

    return {
      ngModule: CdkDatagridModule,
      providers: [
        CdkDatagridFormManager,
        CdkDatagridRuleManager,
        CdkDatagridDataManager,
        CdkDatagridDateAdapter,
        CdkDatagridEditManager,
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

export type DatagridOptions<Item = unknown> = {
  datepicker?: {
    providers?: Provider[];
    formats?: PartialDeep<MatDateFormats>;
  };
  input?: {
    // @see: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
    formats?: DatagridInputFormats<Item>;
    numbers?: DatagridInputNumbers<Item>;
  };
};
