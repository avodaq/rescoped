import { SkygridLogoSvgComponent } from './skygrid-logo-svg.component';
import { render } from '@testing-library/angular';

describe('SkyGridLogoSvgComponent', () => {
  let component: SkygridLogoSvgComponent;

  beforeEach(async () => {
    const skiGridLogo = await render(SkygridLogoSvgComponent);

    component = skiGridLogo.fixture.componentInstance;
    skiGridLogo.detectChanges;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
