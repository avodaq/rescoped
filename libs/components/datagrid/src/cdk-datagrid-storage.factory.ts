import { Self } from '@angular/core';
import { CdkDatagridStorageDirective } from './cdk-datagrid-storage.directive';
import { providerTokenFactory } from '@rescoped/provider/factory';

export const { DATAGRID_STORAGE_PROVIDER, DATAGRID_STORAGE_TOKEN } = providerTokenFactory(
  'DATAGRID_STORAGE',
  CdkDatagridStorageDirective,
  [Self],
);
