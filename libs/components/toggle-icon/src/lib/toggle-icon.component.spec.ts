import { ComponentFixture } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { render, RenderResult } from '@testing-library/angular';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSlideToggleHarness } from '@angular/material/slide-toggle/testing';
import {
  ToggleIconComponent,
  UNCHECKED_ICON,
  TOGGLE_THUMB_SEL,
  CHECKED_ICON,
} from './toggle-icon.component';

import { ToggleIconModule } from './toggle-icon.module';

describe('AvoToggleComponent', () => {
  let renderResult: RenderResult<ToggleIconComponent>;
  let fixture: ComponentFixture<ToggleIconComponent>;
  let slideToggle: MatSlideToggleHarness;
  let component: ToggleIconComponent;
  let toggleThumbEl: HTMLElement;
  let loader: HarnessLoader;
  const currentIconName = () =>
    getComputedStyle(toggleThumbEl, ':before').getPropertyValue('content').replace(/"/g, '');

  beforeEach(async () => {
    renderResult = await render(ToggleIconComponent, {
      imports: [ToggleIconModule],
    });

    fixture = renderResult.fixture;
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    slideToggle = await loader.getHarness(MatSlideToggleHarness);
    toggleThumbEl = fixture.nativeElement.querySelector(TOGGLE_THUMB_SEL);
  });

  describe('icon', () => {
    it('should test default settings', async () => {
      expect(await slideToggle.isChecked()).toBeFalse();
      expect(currentIconName()).toEqual(CHECKED_ICON);
    });

    it('should test toggle icon', async () => {
      await slideToggle.check();
      expect(await slideToggle.isChecked()).toBeTrue();
      expect(currentIconName()).toEqual(UNCHECKED_ICON);

      await slideToggle.uncheck();
      expect(currentIconName()).toEqual(CHECKED_ICON);
    });

    it('should check predefined settings checked input', async () => {
      component.checked = true;

      expect(await slideToggle.isChecked()).toBeTrue();
      expect(currentIconName()).toEqual(UNCHECKED_ICON);

      await slideToggle.uncheck();
      expect(await slideToggle.isChecked()).toBeFalse();
      expect(currentIconName()).toEqual(CHECKED_ICON);
    });
  });

  describe('change', () => {
    it('should test changed event', async () => {
      spyOn(component.changed, 'emit');

      await slideToggle.check();
      expect(await slideToggle.isChecked()).toBeTrue();
      expect(component.changed.emit).toHaveBeenCalledWith(true);

      await slideToggle.uncheck();
      expect(await slideToggle.isChecked()).toBeFalse();
      expect(component.changed.emit).toHaveBeenCalledWith(false);
    });
  });
});
