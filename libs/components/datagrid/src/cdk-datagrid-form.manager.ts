import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { CdkDatagridFormControlDirective } from './cdk-datagrid-form-control.directive';
import { batchValidatorFactory, Validation } from './cdk-datagrid-batch.validation';
import { Observable } from 'rxjs';
import { Validators } from './cdk-datagrid.validators';
import { tap } from 'rxjs/operators';
import { CdkDatagridRuleManager } from './cdk-datagrid-rule.manager';
import { CdkDatagridDataManager } from './cdk-datagrid-data.manager';
import { getItemPayload } from './cdk-datagrid.utils';

export type DatagridForms<Item> = Map<string, CdkDatagridFormControlDirective<Item>>;

@Injectable()
export class CdkDatagridFormManager<
  Item,
  ItemKey extends keyof Item = keyof Item,
  ItemValue extends Item[ItemKey] = Item[ItemKey],
> {
  constructor(
    private readonly _formBuilder: UntypedFormBuilder,
    private readonly _dataManger: CdkDatagridDataManager<Item>,
    private readonly _ruleManager: CdkDatagridRuleManager<Item>,
  ) {}

  #formControlsByIds: DatagridForms<Item> = new Map();

  #formGroup = this._formBuilder.group({});

  formGroupControls = this.#formGroup.controls;

  #prevValidations: Validation[] = [];

  #batchValidation$!: Observable<Validation[]>;

  getBatchValidation() {
    return this.#batchValidation$;
  }

  setBatchValidation(batchValidations: Observable<Validation[]>) {
    this.#batchValidation$ = batchValidations;
  }

  addFormControl(
    formControlName: string,
    value: ItemValue,
    formControlDir: CdkDatagridFormControlDirective<Item>,
    asyncValidatorFn = Validators.nullAsyncValidator(),
  ) {
    this.#formGroup.addControl(
      formControlName,
      this._formBuilder.group({
        [formControlName]: this._formBuilder.control(value, {
          validators: [...(formControlDir.validator?.validator || [])],
          asyncValidators: [...(formControlDir.validator?.asyncValidator || []), asyncValidatorFn],
          updateOn: formControlDir.validator?.updateOn ?? 'submit',
        }),
      }),
    );

    this.#formControlsByIds.set(formControlName, formControlDir);
  }

  watchBatchValidations(batchValidation$: Observable<Validation[]>) {
    this.setBatchValidation(batchValidation$);

    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    return batchValidation$.pipe(
      tap((validations = []) => {
        // reset prev errors
        this.#prevValidations.forEach(({ index, field }) => {
          const formControl = this.#formControlsByIds.get(`${index}-${field}`);
          formControl?.setError(null);
        });

        validations.forEach(({ index, field, validationCode, validationMessage }) => {
          const item = this._dataManger.getItemByIndex(index);
          const itemPayload = getItemPayload(item);
          const actionType = itemPayload?.actionType;

          const formControl = this.#formControlsByIds.get(`${index}-${field}`);
          const ruleTypes = this._ruleManager.getRule(item, <ItemKey>field, actionType);
          if (ruleTypes.validate && formControl) {
            formControl?.setError({ validationCode, validationMessage });
          }
        });

        this.#prevValidations = validations;
      }),
    );
  }

  createAsyncBatchValidator(key: ItemKey, index: number) {
    let batchValidator = Validators.nullAsyncValidator();
    const batchValidation = this.getBatchValidation();
    if (batchValidation) {
      batchValidator = batchValidatorFactory(batchValidation, key as never, index);
    }
    return batchValidator;
  }

  getFormControlGroup(uuid: string): UntypedFormGroup {
    return this.#formGroup.get(uuid) as UntypedFormGroup;
  }

  getFormControl(uuid: string) {
    return this.getFormControlGroup(uuid)?.get(uuid);
  }

  removeFormControl(uuid: string) {
    this.#formGroup.removeControl(uuid);
    this.#formControlsByIds.delete(uuid);
  }
}
