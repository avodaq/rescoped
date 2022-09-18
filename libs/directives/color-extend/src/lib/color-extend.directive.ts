import {
  AfterContentInit,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  OnInit,
  QueryList,
} from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { MatDatepicker } from '@angular/material/datepicker';
import { take } from 'rxjs/operators';

@Directive({
  selector: '[avoColorExtend]',
})
export class ColorExtendDirective implements AfterContentInit, OnInit {
  @ContentChildren(MatSelect) mySelectChildren!: QueryList<MatSelect>;
  @ContentChildren(MatDatepicker) myDatepickerChildren!: QueryList<MatDatepicker<Date>>;
  @Input() avoColorExtend?: string;

  constructor(private readonly el: ElementRef) {}

  ngOnInit() {
    const nativeElement = this.el.nativeElement;
    // Remove eventual material classes
    nativeElement.classList.remove('mat-primary');
    nativeElement.classList.remove('mat-accent');
    // Apply classExtend-directive-string to this element
    nativeElement.classList.add('mat-' + this.avoColorExtend);
  }

  ngAfterContentInit() {
    // Apply classExtend-directive-string to mat-datepicker overlay
    this.myDatepickerChildren.forEach(myDatepickerChild =>
      myDatepickerChild.openedStream.pipe(take(1)).subscribe(() => {
        myDatepickerChild.panelClass = 'mat-' + this.avoColorExtend;
      }),
    );
    // Apply classExtend-directive-string to mat-select overlay
    this.mySelectChildren.forEach(mySelectChild =>
      mySelectChild.openedChange.pipe(take(1)).subscribe(() => {
        mySelectChild.panelClass = 'mat-' + this.avoColorExtend;
      }),
    );
  }
}
