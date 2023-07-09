import { enableProdMode, LOCALE_ID } from '@angular/core';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_FORMAT_DATE_INPUT, provideDataGrid } from '@rescoped/components/datagrid';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideDataGrid({
      datepicker: {
        formats: {
          display: { dateInput: 'DD.MM.YYYY' },
        },
        providers: [
          { provide: LOCALE_ID, useValue: 'de-DE' },
          { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
          { provide: MAT_FORMAT_DATE_INPUT, useValue: 'YYYY-MM-DDT12:00:00[Z]' },
        ],
      },
    }),
    provideAnimations(),
  ],
}).catch(err => console.error(err));
