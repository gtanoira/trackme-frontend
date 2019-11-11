import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatRadioModule } from '@angular/material/radio';

// External Libraries
import { DynamicModule } from 'ng-dynamic-component';

// Services
import { AgGridLoadingComponent } from '../shared/spinners/ag_grid/ag-grid_loading.component';
import { AuthenticationService } from '../shared/authentication.service';
import { AuxiliarTableService } from '../shared/auxiliar_table.service';
import { CompanyService } from '../shared/company.service';
import { CountryService } from '../shared/country.service';
import { CustomerOrderService } from '../shared/customer_order.service';
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

// Authentication & Authorization
import { LoginComponent } from './login/login.component';

// Customer Orders Components
import { CustomerOrderTabsComponent } from './customer_orders/customer_order_tabs.component';
import { COrderGridComponent } from './customer_orders/grid/grid.component';
import { COrderFormComponent } from './customer_orders/form/form.component';
import { COrderFormTabsComponent } from './customer_orders/form/form_tabs/tabs.component';
import { COrderEventsComponent } from './customer_orders/form/events/events.component';

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
    // Customer Orders
    CustomerOrderTabsComponent,
    COrderGridComponent,
    COrderFormComponent,
    COrderFormTabsComponent,
    COrderEventsComponent
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
    ReactiveFormsModule,
    routing,
    // Customer Orders
    DynamicModule.withComponents([
      CustomerOrderTabsComponent,
      COrderGridComponent,
      COrderFormComponent
    ])
  ],
  exports: [
    OnlyNumbersDirective,
  ],
  providers: [
    AuthenticationService,
    AuxiliarTableService,
    CompanyService,
    CountryService,
    CustomerOrderService,
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
