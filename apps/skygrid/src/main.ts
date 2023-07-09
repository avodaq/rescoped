import { enableProdMode, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { MatCardModule } from '@angular/material/card';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { SkyGridData } from './app/skygrid-data';
import { CdkDatagridModule, MAT_FORMAT_DATE_INPUT } from '@rescoped/components/datagrid';
import { MatTableModule } from '@angular/material/table';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { withEnabledBlockingInitialNavigation, provideRouter } from '@angular/router';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      ScrollingModule,
      MatTableModule,
      CdkDatagridModule.forRoot<SkyGridData>({
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
      TableVirtualScrollModule,
      MatCardModule,
    ),
    provideAnimations(),
    provideRouter([], withEnabledBlockingInitialNavigation()),
  ],
}).catch(err => console.error(err));
