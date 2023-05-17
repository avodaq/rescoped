import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkygridLogoSvgComponent } from './skygrid-logo-svg.component';

describe('SkygridLogoSvgComponent', () => {
  let component: SkygridLogoSvgComponent;
  let fixture: ComponentFixture<SkygridLogoSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkygridLogoSvgComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkygridLogoSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
