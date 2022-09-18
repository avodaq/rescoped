import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTableModule } from '@angular/material/table';
import { CdkSpreadsheetModule, MAT_FORMAT_DATE_INPUT } from '@rescoped/components/spreadsheet';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { SkyGridData } from './skygrid-data2';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SkyGridComponent } from './skygrid.component';
import { MatCardModule } from '@angular/material/card';
import { ToggleIconThemeModule } from '@rescoped/components/toggle-icon-theme';

@NgModule({
  declarations: [AppComponent, SkyGridComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    RouterModule.forRoot([], { initialNavigation: 'enabledBlocking' }),
    ScrollingModule,
    MatTableModule,
    CdkSpreadsheetModule.forRoot<SkyGridData>({
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
    ToggleIconThemeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
