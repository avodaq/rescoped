import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToggleIconThemeComponent } from './toggle-icon-theme.component';
import { ToggleIconThemeModule } from './toggle-icon-theme.module';
import { ToggleIconComponent } from '@rescoped/components/toggle-icon';
import { render, RenderResult } from '@testing-library/angular';
import { ThemeStore, MockStorageMapProvider } from '@rescoped/services/theme-store';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { bufferCount } from 'rxjs/operators';

describe('AvoToggleThemeComponent', () => {
  let toggleThemeComponent: ToggleIconThemeComponent;
  let fixture: ComponentFixture<ToggleIconThemeComponent>;
  let renderResult: RenderResult<ToggleIconThemeComponent>;
  let debugElement: DebugElement;
  let themeSwitcher: ThemeStore;
  let toggleComponent: ToggleIconComponent;

  beforeEach(async () => {
    renderResult = await render(ToggleIconThemeComponent, {
      imports: [ToggleIconThemeModule],
      providers: [ThemeStore, MockStorageMapProvider],
    });

    fixture = renderResult.fixture;
    debugElement = fixture.debugElement;
    toggleThemeComponent = fixture.componentInstance;
    themeSwitcher = TestBed.inject(ThemeStore);
    toggleComponent = debugElement.query(By.directive(ToggleIconComponent)).componentInstance;
  });

  afterEach(async () => {
    await themeSwitcher.clear();
  });

  it('should create', () => {
    expect(toggleThemeComponent).toBeTruthy();
  });

  describe('input checked', () => {
    it('should emit active states', done => {
      themeSwitcher.active$.pipe(bufferCount(3)).subscribe(a => {
        expect(a).toEqual([false, true, false]);
        done();
      });

      toggleThemeComponent._changed(true);
      toggleThemeComponent._changed(false);
    });
  });

  describe('input color', () => {
    it('should use default color', () => {
      expect(toggleComponent.color).toEqual('primary');
    });

    it('should set default color', () => {
      toggleComponent.color = 'primary';
      renderResult.detectChanges();
      expect(toggleComponent.color).toEqual('primary');

      toggleComponent.color = 'accent';
      renderResult.detectChanges();
      expect(toggleComponent.color).toEqual('accent');

      toggleComponent.color = 'warn';
      renderResult.detectChanges();
      expect(toggleComponent.color).toEqual('warn');
    });
  });
});
