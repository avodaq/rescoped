import { ChangeDetectorRef, Directive, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControlOptions,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { CdkDatagridFormManager } from './cdk-datagrid-form.manager';
import { DATAGRID_STORAGE_TOKEN } from './cdk-datagrid-storage.factory';
import { CdkDatagridStorageDirective } from './cdk-datagrid-storage.directive';
import { takeUntil, tap } from 'rxjs/operators';
import { FieldValidationErrors } from './cdk-datagrid.validators';
import { CdkDatagridRuleManager } from './cdk-datagrid-rule.manager';
import { getItemPayload } from './cdk-datagrid.utils';

export interface DatagridValidation {
  validator?: ValidatorFn[];
  asyncValidator?: AsyncValidatorFn[];
  updateOn?: AbstractControlOptions['updateOn'];
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[cdk-datagrid-edit]',
  standalone: true,
})
export class CdkDatagridFormControlDirective<Item> implements OnInit, OnDestroy {
  constructor(
    private readonly _cdr: ChangeDetectorRef,
    @Inject(DATAGRID_STORAGE_TOKEN)
    private readonly _storage: CdkDatagridStorageDirective<Item>,
    private readonly _formManager: CdkDatagridFormManager<Item>,
    private readonly _ruleManager: CdkDatagridRuleManager<Item>,
  ) {}

  readonly #unsub$ = new Subject<void>();

  get canRender() {
    const { key, actionType, item } = this._storage;
    return this._ruleManager.getRule(item, key, actionType)?.render;
  }

  get formControlGroup() {
    return this._formManager.getFormControlGroup(this.formControlName);
  }

  get formControlName() {
    return this._storage.createUuid();
  }

  @Input() validator: DatagridValidation = {
    validator: [],
    asyncValidator: [],
    updateOn: 'submit',
  };

  get initialValue() {
    return this._storage.item[this._storage.renderKey || this._storage.key];
  }

  get value() {
    return this.control?.value;
  }

  get control() {
    return this._formManager?.getFormControl(this._storage.createUuid());
  }

  get disabled() {
    return this.control?.disabled;
  }

  get valid() {
    return this.control?.valid;
  }

  get errors(): FieldValidationErrors | null {
    return this.control?.errors as FieldValidationErrors | null;
  }

  setError(errors: ValidationErrors | null) {
    return this.control?.setErrors(errors);
  }

  validate() {
    if (this.valid) {
      this.control?.markAsUntouched();
    } else {
      this.control?.markAsTouched();
    }
  }

  ngOnInit() {
    const { key, index, item } = this._storage;
    const actionType = getItemPayload(item).actionType;
    const batchValidator = this._formManager.createAsyncBatchValidator(key, index);

    this._formManager.addFormControl(this.formControlName, this.initialValue, this, batchValidator);
    const formControl = this._formManager?.getFormControl(this.formControlName);

    const initialValue = this.initialValue as unknown as string;
    this._ruleManager.applyRules(item, key, actionType, formControl, initialValue);

    formControl?.statusChanges
      .pipe(
        tap(() => this._cdr.markForCheck()),
        takeUntil(this.#unsub$),
      )
      .subscribe();
  }

  ngOnDestroy() {
    if (this._storage.item && this._formManager.formGroupControls[this.formControlName]) {
      this._formManager.removeFormControl(this.formControlName);
    }

    this.#unsub$.next();
    this.#unsub$.complete();
  }
}
