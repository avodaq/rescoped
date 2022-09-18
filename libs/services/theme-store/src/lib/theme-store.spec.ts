import { TestBed } from '@angular/core/testing';
import { ThemeStore } from './theme-store.service';
import { MockStorageMapProvider } from './theme-store.mock';
import { defaultThemeState, THEME, ThemeState } from './theme-store.models';
import { bufferCount } from 'rxjs/operators';

const classList = document.body.classList;
let themeSwitcher: ThemeStore;

describe('AvoThemeSwitcherService', () => {
  afterEach(async () => await themeSwitcher.clear());
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThemeStore, MockStorageMapProvider],
    });
    themeSwitcher = TestBed.inject(ThemeStore);
  });

  describe('Theme', () => {
    it('should not contain theme css class when initialized', () => {
      expect(classList.contains(THEME)).toBeFalse();
    });

    it('should toggle between theme css classes', () => {
      themeSwitcher.setActive(true);
      expect(classList.contains(THEME)).toBeTruthy();

      themeSwitcher.setActive(false);
      expect(classList.contains(THEME)).toBeFalse();

      themeSwitcher.setActive(true);
      expect(classList.contains(THEME)).toBeTruthy();
    });
  });

  describe('State', () => {
    it('should emit active states', done => {
      themeSwitcher.active$.pipe(bufferCount(3)).subscribe(a => {
        expect(a).toEqual([false, true, false]);
        done();
      });

      themeSwitcher.setActive(true);
      themeSwitcher.setActive(false);
    });
  });
});

describe('AvoThemeSwitcherService', () => {
  describe('Storage (indexedDB)', () => {
    let state!: ThemeState | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [ThemeStore],
      });
      themeSwitcher = TestBed.inject(ThemeStore);
    });

    afterEach(async () => {
      await themeSwitcher.clear();
    });

    it('should emit different states', async () => {
      state = await themeSwitcher._storage$.toPromise();
      expect(state).toEqual(defaultThemeState);

      themeSwitcher.setActive(true);
      state = await themeSwitcher._storage$.toPromise();
      expect(state).toEqual({ ...defaultThemeState, active: true });

      themeSwitcher.setActive(false);
      state = await themeSwitcher._storage$.toPromise();
      expect(state).toEqual({ ...defaultThemeState, active: false });
    });
  });
});
