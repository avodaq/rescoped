import { ComponentFixture } from '@angular/core/testing';

import { SkygridLogoSvgComponent } from './skygrid-logo-svg.component';
import { render } from '@testing-library/angular';

describe('SkyGridLogoSvgComponent', () => {
  let component: SkygridLogoSvgComponent;
  let fixture: ComponentFixture<SkygridLogoSvgComponent>;

  beforeEach(async () => {
    const skiGridLogo = await render(SkygridLogoSvgComponent);

    component = skiGridLogo.fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
