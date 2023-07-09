import { Directive, HostBinding } from '@angular/core';
import { CdkDatagridDirective } from './cdk-datagrid.directive';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'mat-table[mat-datagrid]',
  exportAs: 'matDatagrid',
  standalone: true,
})
export class MatDatagridDirective<Item extends object = object> extends CdkDatagridDirective<Item> {
  @HostBinding('class.mat-datagrid') override hostClass = true;
}
