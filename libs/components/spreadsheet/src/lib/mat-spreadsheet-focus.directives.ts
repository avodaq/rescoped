import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef, Inject } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { CdkSpreadsheetFormControlDirective } from './cdk-spreadsheet-form-control.directive';
import { SPREADSHEET_FORM_CONTROL_TOKEN } from './cdk-spreadsheet-form-control.factory';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input[cdkFocusInput]',
})
export class CdkSpreadsheetFocusInputDirective<Item> implements AfterViewInit {
  constructor(
    @Inject(SPREADSHEET_FORM_CONTROL_TOKEN)
    public readonly _formControl: CdkSpreadsheetFormControlDirective<Item>,
    private readonly _elementRef: ElementRef<HTMLInputElement>,
    private readonly _cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit() {
    // @todo: dry (*1)(move into factory)
    this._formControl.validate();
    this._elementRef.nativeElement.focus();
    this._cdr.detectChanges();
  }
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input[matAutocomplete][cdkFocusCombobox]',
})
export class CdkSpreadsheetFocusComboboxDirective<Item> implements AfterViewInit {
  constructor(
    @Inject(SPREADSHEET_FORM_CONTROL_TOKEN)
    public readonly _formControl: CdkSpreadsheetFormControlDirective<Item>,
    private readonly _elementRef: ElementRef<HTMLInputElement>,
    private readonly _autoComplete: MatAutocompleteTrigger,
    private readonly _cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit() {
    // @todo: dry (*1)(move into factory))
    this._formControl.validate();
    this._elementRef.nativeElement.focus();
    this._cdr.detectChanges();
    setTimeout(() => this._autoComplete.openPanel(), 0);
  }
}
