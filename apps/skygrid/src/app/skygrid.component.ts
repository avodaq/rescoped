import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { destinations, flightStatus, gates, SkyGridData, skyGridData } from './skygrid-data2';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { ThemeStore } from '@rescoped/services/theme-store';

import {
  GlobalRules,
  ItemRules,
  SpreadsheetValidation,
  Validators,
} from '@rescoped/components/spreadsheet';

@Component({
  selector: 'avo-skygrid',
  templateUrl: './skygrid.component.html',
  styleUrls: ['./skygrid.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyGridComponent implements OnInit {
  readonly _active$ = this._themeStore.active$;
  constructor(private readonly _themeStore: ThemeStore) {}

  readonly tableColumns = [
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
    'global-edit': this.commonRules,
    'group-edit': this.commonRules,
    'single-edit': {
      validate: true,
      overrides: {
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

  readonly flightNumberValidation: SpreadsheetValidation = {
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

  readonly flightStatusValidation: SpreadsheetValidation = {
    validator: [
      Validators.required({
        validationCode: 'PLEASE_SELECT_FLIGHT_STATUS',
        validationMessage: 'Please select a flight status',
      }),
    ],
  };

  readonly durationAValidation: SpreadsheetValidation = {
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

  readonly destinationValidation: SpreadsheetValidation = {
    validator: [
      Validators.required({
        validationCode: 'PLEASE_SELECT_DESTINATION',
        validationMessage: 'Please select a destination',
      }),
    ],
  };

  readonly standardValidation: SpreadsheetValidation = {
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
