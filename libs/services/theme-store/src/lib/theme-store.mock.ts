import { Observable, of } from 'rxjs';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Provider } from '@angular/core';
import { ThemeState } from './theme-store.models';

export class MockStorageMap {
  private _value$: Observable<ThemeState | undefined> = of(undefined);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  set(_: string, value: ThemeState) {
    return (this._value$ = of(value));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  get(_: string) {
    return this._value$;
  }

  clear() {
    return of(undefined);
  }
}

export const MockStorageMapProvider: Provider = { provide: StorageMap, useClass: MockStorageMap };
