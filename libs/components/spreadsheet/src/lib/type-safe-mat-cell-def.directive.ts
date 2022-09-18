import { Directive, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';

// @credits: https://nartc.me/blog/typed-mat-cell-def
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[matCellDef],[cdkCellDef]',
})
export class TypeSafeMatCellDefDirective<T> {
  @Input() matCellDefType!: T[] | Observable<T[]> | MatTableDataSource<T>;

  static ngTemplateContextGuard<T>(
    dir: TypeSafeMatCellDefDirective<T>,
    ctx: unknown,
  ): ctx is {
    // @extended from https://material.angular.io/cdk/table/api#CdkCellOutletRowContext
    $implicit: T;
    count: number;
    even: number;
    first: number;
    index: number;
    last: number;
    odd: number;
  } {
    return true;
  }
}
