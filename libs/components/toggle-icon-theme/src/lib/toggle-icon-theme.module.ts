import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleIconThemeComponent } from './toggle-icon-theme.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ToggleIconModule } from '@rescoped/components/toggle-icon';

@NgModule({
  declarations: [ToggleIconThemeComponent],
  imports: [CommonModule, MatSlideToggleModule, ToggleIconModule],
  exports: [ToggleIconThemeComponent],
})
export class ToggleIconThemeModule {}
