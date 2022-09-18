import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
  Validators as _Validators,
} from '@angular/forms';

export interface FieldValidationErrors {
  validationMessage?: string;
  validationCode?: string;
  validationType?: 'error' | 'warning';
}

export const defaultValidationError: FieldValidationErrors = {
  validationMessage: 'unknown error',
  validationCode: 'DEFAULT_UNKNOWN_ERROR',
};

export const mergeValidationErrors = (
  validationError1: ValidationErrors | null,
  validationError2: FieldValidationErrors = defaultValidationError,
): FieldValidationErrors | null => {
  return validationError1 ? { ...validationError1, ...validationError2 } : validationError1;
};

export class Validators {
  static min(min: number, validationError: FieldValidationErrors = {}): ValidatorFn {
    return (control: AbstractControl) =>
      mergeValidationErrors(_Validators.min(min)(control), validationError);
  }

  static max(max: number, validationError: FieldValidationErrors = {}): ValidatorFn {
    return (control: AbstractControl) =>
      mergeValidationErrors(_Validators.max(max)(control), validationError);
  }

  static required(validationError: FieldValidationErrors = {}): ValidatorFn {
    return (control: AbstractControl) =>
      mergeValidationErrors(_Validators.required(control), validationError);
  }

  static requiredTrue(validationError: FieldValidationErrors = {}): ValidatorFn {
    return (control: AbstractControl) =>
      mergeValidationErrors(_Validators.requiredTrue(control), validationError);
  }

  static email(validationError: FieldValidationErrors = {}): ValidatorFn {
    return (control: AbstractControl) =>
      mergeValidationErrors(_Validators.email(control), validationError);
  }

  static minLength(minLength: number, validationError: FieldValidationErrors = {}): ValidatorFn {
    return (control: AbstractControl) =>
      mergeValidationErrors(_Validators.minLength(minLength)(control), validationError);
  }

  static maxLength(maxLength: number, validationError: FieldValidationErrors = {}): ValidatorFn {
    return (control: AbstractControl) =>
      mergeValidationErrors(_Validators.maxLength(maxLength)(control), validationError);
  }

  static pattern(
    pattern: string | RegExp,
    validationError: FieldValidationErrors = {},
  ): ValidatorFn {
    return (control: AbstractControl) =>
      mergeValidationErrors(_Validators.pattern(pattern)(control), validationError);
  }

  static nullValidator(): ValidatorFn {
    return (control: AbstractControl) =>
      mergeValidationErrors(_Validators.nullValidator(control), {});
  }

  static nullAsyncValidator(): AsyncValidatorFn {
    return control => {
      return new Promise<null>(resolve => {
        resolve(null);
        // null validators does nothing!
        // so no control handling needed!
        // control.updateValueAndValidity();
      });
    };
  }
}
