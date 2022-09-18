import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[avoGradientProgressBar]',
})
export class GradientProgressBarDirective {
  @HostBinding('class') elementClass = 'gradient-progress-bar';
}
