import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorExtendDirective } from './color-extend.directive';

@NgModule({
  imports: [CommonModule],
  exports: [ColorExtendDirective],
  declarations: [ColorExtendDirective],
})
export class ColorExtendDirectiveModule {}
