import { AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

export interface Validation {
  index: number;
  field: string;
  validationCode: string;
  validationMessage: string;
  validationType?: 'error' | 'warning';
}

export function batchValidatorFactory(
  validations: Observable<Validation[]>,
  field: Validation['field'],
  index: Validation['index'],
): AsyncValidatorFn {
  return () =>
    validations.pipe(
      map(validations =>
        validations?.find(validation => {
          return validation.field === field && validation.index === index;
        }),
      ),
      map(validation => (validation ? validation : null)),
      take(1),
    );
}
