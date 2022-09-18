import { Self } from '@angular/core';
import { providerTokenFactory } from '@rescoped/provider';
import { CdkSpreadsheetStorageDirective } from './cdk-spreadsheet-storage.directive';

export const { SPREADSHEET_STORAGE_PROVIDER, SPREADSHEET_STORAGE_TOKEN } = providerTokenFactory(
  'SPREADSHEET_STORAGE',
  CdkSpreadsheetStorageDirective,
  [Self],
);
