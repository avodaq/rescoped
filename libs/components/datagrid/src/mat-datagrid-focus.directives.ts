import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef, Inject } from '@angular/core';
import { CdkDatagridFormControlDirective } from './cdk-datagrid-form-control.directive';
import { DATAGRID_FORM_CONTROL_TOKEN } from './cdk-datagrid-form-control.factory';

// MDC
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input[cdkFocusInput]',
  standalone: true,
})
export class CdkDatagridFocusInputDirective<Item> implements AfterViewInit {
  constructor(
    @Inject(DATAGRID_FORM_CONTROL_TOKEN)
    public readonly _formControl: CdkDatagridFormControlDirective<Item>,
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
  standalone: true,
})
export class CdkDatagridFocusComboboxDirective<Item> implements AfterViewInit {
  constructor(
    @Inject(DATAGRID_FORM_CONTROL_TOKEN)
    public readonly _formControl: CdkDatagridFormControlDirective<Item>,
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
