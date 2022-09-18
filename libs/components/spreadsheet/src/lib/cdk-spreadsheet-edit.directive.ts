import { Directive, ElementRef, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  CDK_EDIT_TAG_CLASS,
  CdkSpreadsheetEdit,
  CdkSpreadsheetEditManager,
} from './cdk-spreadsheet-edit.manager';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[cdk-spreadsheet-edit]',
})
export class CdkSpreadsheetEditDirective implements OnInit, OnDestroy, CdkSpreadsheetEdit {
  constructor(
    private readonly _elementRef: ElementRef<HTMLElement>,
    private readonly _editManager: CdkSpreadsheetEditManager,
  ) {}

  @HostBinding(`class.${CDK_EDIT_TAG_CLASS}`) hostClass = true;
  @Input() editable = true;

  readonly active$ = new BehaviorSubject<boolean>(false);

  activeEdit() {
    this.editable && this.active$.next(true);
  }

  inactiveEdit() {
    this.editable && this.active$.next(false);
  }

  ngOnInit() {
    this._editManager.setEditItem(this._elementRef.nativeElement, this);
  }

  ngOnDestroy() {
    this._editManager.deleteEditItem(this._elementRef.nativeElement);
  }
}
