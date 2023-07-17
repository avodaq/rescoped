import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ThemePalette } from '@angular/material/core';

// MDC
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';

export const CHECKED_ICON = 'bedtime';
export const UNCHECKED_ICON = 'wb_sunny';
export const CHECKED_CSS_VAR = '--avo-toggle-icon-checked';
export const UNCHECKED_CSS_VAR = '--avo-toggle-icon-unchecked';
/** @internal of angular material */
export const TOGGLE_THUMB_SEL = '.mdc-switch__icons';

@Component({
  selector: 'avo-toggle-icon',
  templateUrl: './toggle-icon.component.html',
  styleUrls: ['./toggle-icon.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatSlideToggleModule],
})
export class ToggleIconComponent {
  /** @internal  */
  readonly _checked_css_var = CHECKED_CSS_VAR;

  /** @internal  */
  readonly _unchecked_css_var = UNCHECKED_CSS_VAR;

  /** @internal  */
  _color: ThemePalette = 'primary';

  /** @internal  */
  _checked = false;

  constructor(
    private readonly _cdr: ChangeDetectorRef,
    private readonly _sanitizer: DomSanitizer,
  ) {}

  @HostBinding('class')
  private readonly _hostClass = 'avo-toggle-icon';

  @HostBinding('attr.style')
  private get _valueAsStyle() {
    const style = [this._checkedIcon, this._unCheckedIcon];
    return this._sanitizer.bypassSecurityTrustStyle(style.join(';'));
  }

  /** Will emit an event when ever the underlying mat-slide-toggle is changed */
  @Output() readonly changed = new EventEmitter<boolean>();

  /** Material ThemePalette to be used for the underlying mat-slide-toggle */
  @Input() set color(color: ThemePalette) {
    this._color = color ? color : this._color;
  }
  get color() {
    return this._color;
  }

  /** Checked-Icon to be used for the underlying mat-slide-toggle */
  @Input() checkedIcon = CHECKED_ICON;
  private readonly _checkedIcon = `${this._checked_css_var}: "${this.checkedIcon}"`;

  /** Unchecked-Icon to be used for the underlying mat-slide-toggle */
  @Input() unCheckedIcon = UNCHECKED_ICON;
  private readonly _unCheckedIcon = `${this._unchecked_css_var}: "${this.unCheckedIcon}"`;

  /** Checked state to be used for the underlying mat-slide-toggle */
  @Input() set checked(checked: boolean) {
    this._checked = checked;
    this._cdr.detectChanges();
  }
  get checked() {
    return this._checked;
  }

  _toggleChange(event: MatSlideToggleChange) {
    this.changed.emit(event.checked);
  }
}
