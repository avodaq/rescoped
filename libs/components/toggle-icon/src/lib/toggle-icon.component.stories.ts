import { boolean, select } from '@storybook/addon-knobs';
import { ToggleIconModule } from './toggle-icon.module';
import { MatCardModule } from '@angular/material/card';

// @todo: how to type that?

export default {
  title: 'AvoToggleComponent',
};

export const avoToggle = () => ({
  moduleMetadata: {
    imports: [ToggleIconModule, MatCardModule],
  },
  props: {
    color: select('color', ['primary', 'accent', 'warn'], 'primary'),
    checkedIcon: select(
      'checkedIcon',
      ['wb_sunny', 'bedtime', 'favorite_border', 'favorite'],
      'wb_sunny',
    ),
    unCheckedIcon: select(
      'unCheckedIcon',
      ['wb_sunny', 'bedtime', 'favorite_border', 'favorite'],
      'bedtime',
    ),
    checked: boolean('checked', false),
  },
  template: `
    <mat-card>
      <avo-toggle-icon
        [color]='color'
        [checked]='checked'
        [checkedIcon]='checkedIcon'
        [unCheckedIcon]='unCheckedIcon'>
      </avo-toggle-icon>
    </mat-card>`,
});
