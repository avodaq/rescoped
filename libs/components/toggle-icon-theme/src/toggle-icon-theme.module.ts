import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleIconThemeComponent } from './toggle-icon-theme.component';
import { ToggleIconModule } from '@rescoped/components/toggle-icon';

// MDC
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [ToggleIconThemeComponent],
  imports: [CommonModule, MatSlideToggleModule, ToggleIconModule],
  exports: [ToggleIconThemeComponent],
})
export class ToggleIconThemeModule {}
