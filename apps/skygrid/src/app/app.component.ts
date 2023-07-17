import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { SkyGridComponent } from './skygrid.component';

@Component({
  selector: 'avo-root',
  template: '<avo-skygrid></avo-skygrid>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SkyGridComponent],
})
export class AppComponent {
  title = 'skygrid';
}
