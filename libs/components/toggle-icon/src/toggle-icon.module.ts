import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleIconComponent } from './toggle-icon.component';

// MDC
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  imports: [CommonModule, MatSlideToggleModule],
  declarations: [ToggleIconComponent],
  exports: [ToggleIconComponent],
})
export class ToggleIconModule {}
