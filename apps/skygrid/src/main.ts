import { enableProdMode, importProvidersFrom, LOCALE_ID } from '@angular/core';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { MatCardModule } from '@angular/material/card';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { SkyGridData } from './app/skygrid-data';
import { CdkDatagridModule, MAT_FORMAT_DATE_INPUT } from '@rescoped/components/datagrid';
import { MatTableModule } from '@angular/material/table';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule, // can be removed
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
