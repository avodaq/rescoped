import { Directive, Input } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[cdk-datagrid-edit]',
  standalone: true,
})
export class CdkDatagridCommonDirective {
  @Input() type: 'text' | 'number' | 'time' = 'text';

  #autocomplete = 'off';

  get autocomplete() {
    return this.#autocomplete as unknown as boolean;
  }
  @Input() set autocomplete(value: boolean) {
    this.#autocomplete = value ? 'on' : 'off';
  }
}
