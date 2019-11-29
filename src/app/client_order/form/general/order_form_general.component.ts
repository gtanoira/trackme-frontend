import { Component, OnInit, Input, AfterViewInit, AfterContentInit, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

// Services
import { AuxiliarTableService } from '../../../../shared/auxiliar_table.service';
import { OrderService } from '../../../../shared/order.service';
import { EntityService } from '../../../../shared/entity.service';
import { ErrorMessageService } from '../../../../shared/error-message.service';

// Structures and models
import { SelectOptions } from '../../../../models/select_options';
import { EntityModel } from '../../../../models/entity.model';

/* ***********************************************************************
    DATE formatting settings
*/
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment} from 'moment';

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
// *********************************************************************

@Component({
  selector: 'app-order-form-general',
  templateUrl: './order_form_general.component.html',
  styleUrls: ['./order_form_general.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})

export class OrderFormGeneralComponent implements OnInit {

  // Input Order Form as a parameters
  @Input() formData: FormGroup;

  // Select-Options for fields
  companyOptions: SelectOptions[];
  clientOptions: SelectOptions[];

  // Other fields
  showFromEntityDropDown = false;
  showToEntityDropDown   = false;

  // Client Order Types Options
  ordersTypeOptions: SelectOptions[] = this.auxiliarTableService.getClientOrderTypes();
  // Order Status Options
  statusOptions: SelectOptions[] = this.auxiliarTableService.getOrderStatus();
  // Shipment Method
  shipmentOptions: SelectOptions[] = this.auxiliarTableService.getShipmentMethods();
  // Incoterm Options
  incotermOptions: SelectOptions[] = this.auxiliarTableService.getIncoterms();

  constructor(
    private errorMessageService: ErrorMessageService,
    private auxiliarTableService: AuxiliarTableService,
    private orderService: OrderService,
    private entityService: EntityService,
   ) {}

  ngOnInit() {
    console.log('*** formData (order_form_general):', this.formData);

    // Get Client Options
    this.entityService.getAllClients().subscribe(
      data => {
        // Set the form data with the order
        this.clientOptions = data.map(row => row);
      }
    );
  }

  // GETTERS
  get orderId() { return this.formData.get('general').get('id'); }
  get companyId() { return this.formData.get('general').get('companyId'); }
  get clientId() { return this.formData.get('general').get('clientId'); }
  get orderNo() { return this.formData.get('general').get('orderNo'); }
  get orderDatetime() { return this.formData.get('general').get('orderDatetime'); }
  get orderType() { return this.formData.get('general').get('orderType'); }
  get shipmentMethod() { return this.formData.get('general').get('shipmentMethod'); }
  get incoterm() { return this.formData.get('general').get('incoterm'); }
  get pieces() { return this.formData.get('general').get('pieces'); }
  get deliveryDate() { return this.formData.get('general').get('deliveryDate'); }
  get eta() { return this.formData.get('general').get('eta'); }
  get thirdPartyId() { return this.formData.get('general').get('thirdPartyId'); }
  get observations() { return this.formData.get('general').get('observations'); }

  /* ngAfterContentInit() {
    if (this.orderId.value != null) {
      this.clientId.disable();
      this.companyId.disable();
    }
  } */

  openDropDown(option) {
    if (option === 'from') {
      this.showFromEntityDropDown = !this.showFromEntityDropDown;
    } else {
      this.showToEntityDropDown   = !this.showToEntityDropDown;
    }
  }

  // Trigger validation for item clientID
  validateClientId(control: FormControl): {[s: string]: boolean} {

    // Set the client order's company based on the client
    if (control.value !== '') {
      // Find the company Id that this client belongs to
      this.entityService.getEntityByid(control.value).subscribe(
        data => {
          if (data) {
            this.companyId.setValue(data.companyId);
          }
        }
      );
    }
    return null;  // null means NO errors
  }

  // Save the Order to the DBase
  saveOrder(orderId) {

    // Clear message
    this.errorMessageService.changeErrorMessage('');
    // Save order
    this.orderService.updClientOrderById(orderId, this.formData).subscribe(
      data => {

        // Re-set the order for QUERY modality
        if (this.formData.value.formProperties.mode === 'INSERT') {
          this.formData.value.formProperties.mode = 'QUERY';
          this.formData.get('blkGeneral').get('clientId').disable();
          this.formData.get('blkGeneral').get('companyId').disable();
          this.formData.get('blkGeneral').get('orderNo').setValue(data['orderNo']);
          //this.orderId = data['id'];
          // Output message
          this.errorMessageService.changeErrorMessage(
            `The new client order #${this.orderNo.value} was created succesfuly`
          );
          setTimeout(() => { this.errorMessageService.changeErrorMessage(''); }, 10000);
        } else {
          this.formData.value.formProperties.mode = 'QUERY';
          // Output message
          this.errorMessageService.changeErrorMessage(
            `The order #${this.orderNo.value} was updated succesfuly`
          );
          setTimeout(() => { this.errorMessageService.changeErrorMessage(''); }, 10000);
        }
      },
      err => {
        this.errorMessageService.changeErrorMessage(err);
      }
    );

  }

}
