import { Directive, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { CdkDatagridDirective } from './cdk-datagrid.directive';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[connectWithDatagrid]',
  standalone: true,
})
export class CdkDatagridConnectWithDirective<Item> implements OnInit {
  @Input() connectWithDatagrid: CdkDatagridDirective<Item> | null = null;

  @Output() clickForDatagridItems = new EventEmitter<Item[]>();

  @HostListener('click') clickDatagridAction() {
    if (this.connectWithDatagrid) {
      this.clickForDatagridItems.emit(this.connectWithDatagrid.items);
      this.connectWithDatagrid.setValueChange(null);
    }
  }

  ngOnInit() {
    if (!this.connectWithDatagrid) {
      throw new Error('[cdk-datagrid-action] must have a [connectWithDatagrid] input');
    }

    const instanceOfDatagrid = this.connectWithDatagrid instanceof CdkDatagridDirective;
    if (this.connectWithDatagrid && !instanceOfDatagrid) {
      throw new Error('[connectWithDatagrid] input must of type CdkDatagridDirective');
    }
  }
}
