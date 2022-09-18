import { Self } from '@angular/core';
import { CdkSpreadsheetCommonDirective } from './cdk-spreadsheet-common.directive';
import { providerTokenFactory } from '@rescoped/provider';

// @todo: rename to providerFactory
export const { SPREADSHEET_COMMON_PROVIDER, SPREADSHEET_COMMON_TOKEN } = providerTokenFactory(
  'SPREADSHEET_COMMON',
  CdkSpreadsheetCommonDirective,
  [Self],
);
