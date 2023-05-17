import { ChangeDetectionStrategy, Component, HostBinding, ViewEncapsulation } from '@angular/core';
import { CdkDatagridCollapseComponent } from './cdk-datagrid-collapse';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mat-datagrid-collapse',
  template: `
    <div class="cdk-datagrid-collapse">
      <ng-container *ngIf="getActionType === 'row-global'">
        <div class="row-global flex">
          <mat-icon class="m-auto">edit_note</mat-icon>
        </div>
      </ng-container>

      <ng-container *ngIf="getActionType === 'row-group'">
        <button (click)="collapseChanged()" mat-icon-button aria-label="Collapse this group">
          <mat-icon>
            {{ collapsed ? 'expand_more' : 'expand_less' }}
          </mat-icon>
        </button>
      </ng-container>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatDatagridCollapseComponent<Item> extends CdkDatagridCollapseComponent<Item> {
  @HostBinding('class.mat-datagrid-collapse') override hostClass = true;
  @HostBinding('class.mat-datagrid-collapsible') override collapsibleClass = true;

  @HostBinding('class.mat-datagrid-collapsed') override get collapsedClass() {
    return this.collapsed;
  }
}
