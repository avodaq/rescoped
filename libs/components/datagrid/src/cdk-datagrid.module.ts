import {
  DatagridInputFormats,
  DatagridInputNumbers,
  MAT_FORMAT_INPUT,
  MAT_NUMBER_INPUT,
} from './mat-datagrid-input';

//MDC
import { PartialDeep } from './cdk-datagrid.types';
import { LOCALE_ID, ModuleWithProviders, NgModule, Provider } from '@angular/core';
import {
  CdkDatagridDateAdapter,
  MAT_DATE_CLASS,
  matDateFormatsDefaults,
} from './cdk-datagrid-date.adapter';
import deepmerge from 'deepmerge';
import moment from 'moment';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatDateFormats,
} from '@angular/material/core';
import { CdkDatagridRuleManager } from './cdk-datagrid-rule.manager';
import { CdkDatagridEditManager } from './cdk-datagrid-edit.manager';
import { CdkDatagridFormManager } from './cdk-datagrid-form.manager';
import { CdkDatagridDataManager } from './cdk-datagrid-data.manager';

@NgModule()
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
