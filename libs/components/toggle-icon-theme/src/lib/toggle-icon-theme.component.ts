import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ThemeStore } from '@rescoped/services/theme-store';

@Component({
  selector: 'avo-toggle-icon-theme',
  templateUrl: './toggle-icon-theme.component.html',
  styleUrls: ['./toggle-icon-theme.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleIconThemeComponent {
  /** The active themeStore state */
  readonly _active$ = this._themeStore.active$;

  constructor(private readonly _themeStore: ThemeStore) {}

  @HostBinding('class')
  private readonly _hostClass = 'avo-toggle-icon-theme';

  /** Material ThemePalette to be used for the underlying mat-slide-toggle */
  @Input() color: ThemePalette = 'primary';

  /**
   * Will called when ever the toggle state is changed
   * @docs-private
   */
  _changed(changed: boolean) {
    this._themeStore.setActive(changed);
  }
}
