## mat-input-component

### see comments (0, 1, 2, 3)

```html
<ng-template #defaultTemplate>
  <div
    *ngIf="!whenActionExists"
    [title]="_formControl?.value"
    class="cdk-default-field"
    [ngClass]="{ disabled: _formControl?.disabled, 'mat-red-500 mat-error': _formControl?.errors }"
  >
    <span>{{ _formControl?.value || _storage?.placeholder }}</span>
    <!--
      0.)
        - https://stackoverflow.com/questions/58048747/using-currency-pipe-without-a-symbol
        - https://stackoverflow.com/questions/62181765/angular-9-currency-pipe-not-showing-euro-symbol
      1.) see https://angular.io/api/common/CurrencyPipe
      2.) locale-code: use { provide: MAT_DATE_LOCALE, useValue: 'en-GB' } in CdkDatagridModule.forRoot
      <span>{{ _formControl?.value | currency }}</span>
      3.) https://angular.io/api/core/LOCALE_ID
      -->
  </div>
</ng-template>
```

### Which data should be taken when check or send data in devicelist or in general?

- insteadof row-single it should depend on some different type in ItemPayload
