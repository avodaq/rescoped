import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { destinations, flightStatus, gates, SkyGridData, skyGridData } from './skygrid-data';
import { ThemeStore } from '@rescoped/services/theme-store';

import {
  CdkDatagridCommonDirective,
  CdkDatagridEditDirective,
  CdkDatagridFormControlDirective,
  CdkDatagridStorageDirective,
  DatagridValidation,
  GlobalRules,
  ItemRules,
  MatDatagridComboboxComponent,
  MatDatagridDirective,
  MatDatagridInputComponent,
  MatDatagridRowDirective,
  TypeSafeMatCellDefDirective,
  Validators,
} from '@rescoped/components/datagrid';
import { TableVirtualScrollDataSource, TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { MatTableModule } from '@angular/material/table';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { SkygridLogoSvgComponent } from './components/skygrid-logo-svg/skygrid-logo-svg.component';
import { MatCardModule } from '@angular/material/card';
import { ToggleIconThemeComponent } from '@rescoped/components/toggle-icon-theme';

@Component({
  selector: 'avo-skygrid',
  templateUrl: './skygrid.component.html',
  styleUrls: ['./skygrid.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCardModule,
    SkygridLogoSvgComponent,
    ToggleIconThemeComponent,
    TypeSafeMatCellDefDirective,

    CdkVirtualScrollViewport,
    MatTableModule,
    CdkDatagridEditDirective,
    MatDatagridDirective,
    MatDatagridInputComponent,
    CdkDatagridCommonDirective,
    CdkDatagridFormControlDirective,
    CdkDatagridStorageDirective,
    MatDatagridComboboxComponent,
    MatDatagridRowDirective,
    TableVirtualScrollModule,
  ],
})
export class SkyGridComponent implements OnInit {
  readonly _active$ = this._themeStore.active$;
  constructor(private readonly _themeStore: ThemeStore) {}

  readonly tableColumns = [
    'collapse',
    'date',
    'airline',
    'flightNumber',
    'status',
    'origin',
    'destination',
    'duration',
    'estArrival',
    'estDeparture',
    'terminal',
    'gate',
  ];

  readonly commonRules: ItemRules<SkyGridData> = {
    render: false,
    overrides: {
      collapse: {
        render: false,
        disable: true,
      },
      date: {
        render: true,
        disable: true,
      },
      airline: {
        disable: true,
      },
      flightNumber: {
        disable: true,
      },
      origin: {
        disable: true,
      },
      destination: {
        disable: true,
      },
    },
  };

  readonly itemRules: GlobalRules<SkyGridData> = {
    'row-global': this.commonRules,
    'row-group': this.commonRules,
    'row-single': {
      validate: true,
      overrides: {
        collapse: {
          disable: true,
        },
        date: {
          disable: true,
        },
        airline: {
          disable: true,
        },
        origin: {
          disable: true,
        },
        status: {
          placeholder: 'Select Status',
        },
      },
    },
  };

  readonly flightNumberValidation: DatagridValidation = {
    validator: [
      Validators.required({
        validationCode: 'REQUIRED_FIELD',
        validationMessage: 'Required field',
      }),
      Validators.pattern(/[A-Z]{2}-[0-9]{4}/, {
        validationCode: 'INVALID_FLIGHT_NUMBER_FORMAT',
        validationMessage: 'Invalid flight number format',
      }),
    ],
  };

  readonly flightStatusValidation: DatagridValidation = {
    validator: [
      Validators.required({
        validationCode: 'PLEASE_SELECT_FLIGHT_STATUS',
        validationMessage: 'Please select a flight status',
      }),
    ],
  };

  readonly durationAValidation: DatagridValidation = {
    validator: [
      Validators.required({
        validationCode: 'REQUIRED_FIELD',
        validationMessage: 'Required field',
      }),
      Validators.pattern(/[0-9]{1,2}h [0-9]{2}min/, {
        validationCode: 'INVALID_DURATION_FORMAT',
        validationMessage: 'Invalid duration format',
      }),
    ],
  };

  readonly destinationValidation: DatagridValidation = {
    validator: [
      Validators.required({
        validationCode: 'PLEASE_SELECT_DESTINATION',
        validationMessage: 'Please select a destination',
      }),
    ],
  };

  readonly standardValidation: DatagridValidation = {
    validator: [
      Validators.required({
        validationCode: 'REQUIRED_FIELD',
        validationMessage: 'Required field',
      }),
    ],
  };

  flightStatus = flightStatus;
  destinations = destinations;
  gates = gates;
  dataSource = new TableVirtualScrollDataSource<SkyGridData>();

  ngOnInit() {
    this.dataSource.data = skyGridData;
  }
}
