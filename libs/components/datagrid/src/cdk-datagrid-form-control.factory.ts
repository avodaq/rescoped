import { Self } from '@angular/core';
import { providerTokenFactory } from '@rescoped/provider/factory';
import { CdkDatagridFormControlDirective } from './cdk-datagrid-form-control.directive';

export const { DATAGRID_FORM_CONTROL_PROVIDER, DATAGRID_FORM_CONTROL_TOKEN } = providerTokenFactory(
  'DATAGRID_FORM_CONTROL',
  CdkDatagridFormControlDirective,
  [Self],
);
