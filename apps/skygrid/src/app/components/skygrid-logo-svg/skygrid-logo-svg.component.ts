import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'avo-skygrid-logo-svg',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skygrid-logo-svg.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkygridLogoSvgComponent {}
