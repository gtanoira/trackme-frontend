import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatTabsModule
} from '@angular/material';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import {MatDividerModule} from '@angular/material/divider';

// External Libraries
import { DynamicModule } from 'ng-dynamic-component';

// Services
import { AgGridLoadingComponent } from '../shared/ag-grid_loading.component';
import { AuthsService } from '../shared/auths.service';
import { AuxiliarTableService } from '../shared/auxiliar_table.service';
import { CompanyService } from '../shared/company.service';
import { CountryService } from '../shared/country.service';
import { OrderService } from '../shared/order.service';
import { EntityService } from '../shared/entity.service';
import { ErrorMessageService } from '../shared/error-message.service';
import { EventService } from '../shared/event.service';
import { HeightService } from '../shared/height.service';

// Directives
import { OnlyNumbersDirective, ToUppercaseDirective, NumberFormatterDirective } from '../directives/formatter.directive';

// Interceptors
import { interceptorProviders } from '../interceptors/interceptors';

// Componentes
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { MainComponent } from './main_menu/main.component';

// Authentication & Authorization
import { LoginComponent } from './login/login.component';

// Orders Components
import { OrderTabsComponent } from './client_order/order_tabs.component';
import { OrderGridComponent } from './client_order/grid/order_grid.component';
// Order Form Components
import { OrderFormTabsComponent } from './client_order/form/order_form_tabs.component';
import { OrderFormGeneralComponent } from './client_order/form/general/order_form_general.component';
import { OrderFormShipperComponent } from './client_order/form/shipper/order_form_shipper.component';
import { OrderFormConsigneeComponent } from './client_order/form/consignee/order_form_consignee.component';
import { OrderFormEventsComponent } from './client_order/form/events/order_form_events.component';
// Order Form Events Components
import { OrderEventAddComponent } from './client_order/form/events/add/order_event_add.component';
import { OrderEventGridComponent } from './client_order/form/events/grid/order_event_grid.component';
import { OrderEventPublicComponent } from './client_order/form/events/public/order_event_public.component';

/* ***********************************************************************
    DATE formatting settings
*/
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
// import * as moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment} from 'moment';

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY HH:MM:ss',
  },
  display: {
    dateInput: 'llll',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'lll',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
// *********************************************************************

@NgModule({
  declarations: [
    AppComponent,
    AgGridLoadingComponent,
    // Directives
    NumberFormatterDirective,
    OnlyNumbersDirective,
    ToUppercaseDirective,
    // Authentication & Authorization
    LoginComponent,
    // Main menu
    MainComponent,
    // Orders
    OrderTabsComponent,
    OrderGridComponent,
    // Order Form
    OrderFormTabsComponent,
    OrderFormGeneralComponent,
    OrderFormShipperComponent,
    OrderFormConsigneeComponent,
    OrderFormEventsComponent,
    // Order Form events
    OrderEventAddComponent,
    OrderEventGridComponent,
    OrderEventPublicComponent
  ],
  imports: [
    AgGridModule.withComponents([AgGridLoadingComponent]),
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatMomentDateModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    ReactiveFormsModule,
    routing,
    // Orders (dynamic's component))
    DynamicModule.withComponents([
      OrderTabsComponent,
      OrderGridComponent,
      OrderFormTabsComponent
    ])
  ],
  exports: [
    OnlyNumbersDirective
  ],
  providers: [
    AuthsService,
    AuxiliarTableService,
    CompanyService,
    CountryService,
    OrderService,
    EntityService,
    ErrorMessageService,
    EventService,
    HeightService,
    HttpClientModule,
    interceptorProviders,
    // Moment DATE providers
    { provide: MAT_DATE_LOCALE,
      useValue: 'es-SP'
    },
    { provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS,
      useValue: {useUtc: true}
    },
    // Set how to format and display dates
    { provide: MAT_DATE_FORMATS,
      useValue: MY_FORMATS    //MAT_MOMENT_DATE_FORMATS (default formats)
    },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
