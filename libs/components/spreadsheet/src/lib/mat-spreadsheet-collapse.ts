import { ChangeDetectionStrategy, Component, HostBinding, ViewEncapsulation } from '@angular/core';
import { CdkSpreadsheetCollapseComponent } from './cdk-spreadsheet-collapse';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mat-spreadsheet-collapse',
  template: `
    <div class="cdk-spreadsheet-collapse-icon">
      <ng-container *ngIf="getActionType === 'global-edit'">
        <div class="global-edit">
          <mat-icon> edit_note</mat-icon>
        </div>
      </ng-container>

      <ng-container *ngIf="getActionType === 'group-edit'">
        <div class="group-edit">
          <mat-icon (click)="collapseChanged()">
            {{ collapsed ? 'expand_more' : 'expand_less' }}
          </mat-icon>
        </div>
      </ng-container>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatSpreadsheetCollapseComponent<Item> extends CdkSpreadsheetCollapseComponent<Item> {
  @HostBinding('class.mat-spreadsheet-collapse') override hostClass = true;
  @HostBinding('class.mat-spreadsheet-collapsible') override collapsibleClass = true;

  @HostBinding('class.mat-spreadsheet-collapsed') override get collapsedClass() {
    return this.collapsed;
  }
}
