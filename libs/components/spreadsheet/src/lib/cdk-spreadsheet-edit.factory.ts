import { Self } from '@angular/core';
import { providerTokenFactory } from '@rescoped/provider';
import { CdkSpreadsheetEditDirective } from './cdk-spreadsheet-edit.directive';

export const { SPREADSHEET_EDIT_PROVIDER, SPREADSHEET_EDIT_TOKEN } = providerTokenFactory(
  'SPREADSHEET_EDIT',
  CdkSpreadsheetEditDirective,
  [Self],
);
