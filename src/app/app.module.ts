import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DATE_LOCALE,
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
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatRadioModule } from '@angular/material/radio';

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
import { EventTypeService } from '../shared/event_type.service';
import { HeightService } from '../shared/height.service';
import { OrderEventService } from '../shared/order_event.service';
import { WarehouseReceiptService } from '../shared/warehouse_receipt.service';

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
    OrderFormGeneralComponent
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
    OnlyNumbersDirective,
  ],
  providers: [
    AuthsService,
    AuxiliarTableService,
    CompanyService,
    CountryService,
    OrderService,
    EntityService,
    ErrorMessageService,
    EventTypeService,
    HeightService,
    HttpClientModule,
    interceptorProviders,
    OrderEventService,
    WarehouseReceiptService,
    { provide: MAT_DATE_LOCALE,
      useValue: 'es-SP'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
