import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GradientProgressBarDirective } from './gradient-progress-bar.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [GradientProgressBarDirective],
  exports: [GradientProgressBarDirective],
})
export class GradientProgressBarModule {}
