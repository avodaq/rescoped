import { select } from '@storybook/addon-knobs';
import { ToggleIconThemeModule } from './toggle-icon-theme.module';
import { MatCardModule } from '@angular/material/card';

export default {
  title: 'AvoToggleThemeComponent',
};

export const avoToggleTheme = () => ({
  moduleMetadata: {
    imports: [ToggleIconThemeModule, MatCardModule],
  },
  props: {
    color: select('color', ['primary', 'accent', 'warn'], 'primary'),
  },
  template: `
    <mat-card>
      <avo-toggle-icon-theme [color]='color'></avo-toggle-icon-theme>
    </mat-card>`,
});
