import { Self } from '@angular/core';
import { providerTokenFactory } from '@rescoped/provider';
import { CdkSpreadsheetFormControlDirective } from './cdk-spreadsheet-form-control.directive';

export const { SPREADSHEET_FORM_CONTROL_PROVIDER, SPREADSHEET_FORM_CONTROL_TOKEN } =
  providerTokenFactory('SPREADSHEET_FORM_CONTROL', CdkSpreadsheetFormControlDirective, [Self]);
