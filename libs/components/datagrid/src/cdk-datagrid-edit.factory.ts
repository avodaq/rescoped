import { Self } from '@angular/core';
import { providerTokenFactory } from '@rescoped/provider/factory';
import { CdkDatagridEditDirective } from './cdk-datagrid-edit.directive';

export const { DATAGRID_EDIT_PROVIDER, DATAGRID_EDIT_TOKEN } = providerTokenFactory(
  'DATAGRID_EDIT',
  CdkDatagridEditDirective,
  [Self],
);
