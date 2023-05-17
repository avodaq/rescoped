import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
  Validators as _Validators,
} from '@angular/forms';

export class Validators {
  static min(min: number, error?: unknown): ValidatorFn {
    return (control: AbstractControl) =>
      Validators.#validationErrors(_Validators.min(min)(control), error);
  }

  static max(max: number, error?: unknown): ValidatorFn {
    return (control: AbstractControl) =>
      Validators.#validationErrors(_Validators.max(max)(control), error);
  }

  static required(error?: unknown): ValidatorFn {
    return (control: AbstractControl) =>
      Validators.#validationErrors(_Validators.required(control), error);
  }

  static requiredTrue(error?: unknown): ValidatorFn {
    return (control: AbstractControl) =>
      Validators.#validationErrors(_Validators.requiredTrue(control), error);
  }

  static email(error?: unknown): ValidatorFn {
    return (control: AbstractControl) =>
      Validators.#validationErrors(_Validators.email(control), error);
  }

  static minLength(minLength: number, error?: unknown): ValidatorFn {
    return (control: AbstractControl) =>
      Validators.#validationErrors(_Validators.minLength(minLength)(control), error);
  }

  static maxLength(maxLength: number, error?: unknown): ValidatorFn {
    return (control: AbstractControl) =>
      Validators.#validationErrors(_Validators.maxLength(maxLength)(control), error);
  }

  static pattern(pattern: string | RegExp, error?: unknown): ValidatorFn {
    return (control: AbstractControl) =>
      Validators.#validationErrors(_Validators.pattern(pattern)(control), error);
  }

  static nullValidator(): ValidatorFn {
    return (control: AbstractControl) => _Validators.nullValidator(control);
  }

  static nullAsyncValidator(): AsyncValidatorFn {
    return () => new Promise<null>(resolve => resolve(null));
  }

  static #validationErrors(
    validationErrors: ValidationErrors | null,
    error?: unknown,
  ): ValidationErrors | null {
    return validationErrors ? (error ? validationErrors : null) : null;
  }
}
