import { Inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { DOCUMENT } from '@angular/common';
import { exhaustMap, map, mapTo, takeUntil, tap } from 'rxjs/operators';
import { StorageMap } from '@ngx-builders/pwa-local-storage';
import { Observable, Subject } from 'rxjs';
import { defaultThemeState, LS_THEME_KEY, ThemeState } from './theme-store.models';

@Injectable({
  providedIn: 'root',
})
export class ThemeStore extends ComponentStore<ThemeState> {
  private readonly _classList = this._doc.body.classList;
  private readonly _unsub$ = new Subject<void>();

  /** Active selected stream state */
  readonly active$ = this.select(({ active }) => active);

  /** Storage stream which holds the ThemeState */
  readonly _storage$ = this._storage
    .get(LS_THEME_KEY)
    .pipe(map(value => value ?? defaultThemeState)) as unknown as Observable<ThemeState>;

  constructor(
    private readonly _storage: StorageMap,
    @Inject(DOCUMENT) private readonly _doc: Document,
  ) {
    // support APP_INITIALIZER work with observable
    // https://github.com/angular/angular/pull/33222
    super(defaultThemeState);
    this._init();
  }

  /** Should be used for setting the theme state for true or false */
  readonly setActive = this.effect<ThemeState['active']>(themeActive$ =>
    themeActive$.pipe(
      exhaustMap(active => this._setStorage({ active, theme: 'dark' })),
      tap(state => this._set(state)),
    ),
  );

  private _init() {
    this._storage$.pipe(takeUntil(this._unsub$)).subscribe(state => this._set(state));
  }

  /** Sets theme and patches state */
  private _set(state: ThemeState) {
    this._setTheme(state);
    this.patchState(state);
  }

  /** Adds or removes the theme css class to body node */
  private _setTheme(state: ThemeState) {
    state.active ? this._classList.add('dark') : this._classList.remove('dark');
  }

  /** Writes ThemeState into storage */
  private _setStorage(state: ThemeState) {
    return this._storage.set(LS_THEME_KEY, state).pipe(mapTo(state));
  }

  /** Clears the storage and removes the .dark class */
  clear() {
    const storage$ = this._storage.clear().pipe(tap(() => this._classList.remove('dark')));
    this._unsub$.next();
    this._unsub$.complete();

    return storage$.toPromise();
  }
}
