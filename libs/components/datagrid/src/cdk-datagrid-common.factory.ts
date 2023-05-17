import { Self } from '@angular/core';
import { CdkDatagridCommonDirective } from './cdk-datagrid-common.directive';
import { providerTokenFactory } from '@rescoped/provider/factory';

// @todo: rename to providerFactory
export const { DATAGRID_COMMON_PROVIDER, DATAGRID_COMMON_TOKEN } = providerTokenFactory(
  'DATAGRID_COMMON',
  CdkDatagridCommonDirective,
  [Self],
);
