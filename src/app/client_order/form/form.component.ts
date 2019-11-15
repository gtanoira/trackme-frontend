import { Component, OnInit, Input, AfterViewInit, AfterContentInit, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Environment
import { environment } from '../../../environments/environment';

// Services
import { AuxiliarTableService } from '../../../shared/auxiliar_table.service';
import { CustomerOrderService } from '../../../shared/customer_order.service';
import { EntityService } from '../../../shared/entity.service';
import { ErrorMessageService } from '../../../shared/error-message.service';
import { HeightService } from 'src/shared/height.service';

// Structures and models
import { SelectOptions } from '../../../models/select_options';
import { EntityModel } from '../../../models/entity.model';

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
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})

export class COrderFormComponent implements OnInit, AfterViewInit, AfterContentInit {

  // Input Parameters
  @Input() orderId: number;     // Order no.: (null): new order / (id):order to edit

  // Select-Options for fields
  companyOptions: SelectOptions[];
  customerOptions: SelectOptions[];
  // Other fields
  showFromEntityDropDown = false;
  showToEntityDropDown   = false;

  // Customer Order Types Options
  ordersTypeOptions: SelectOptions[] = this.auxiliarTableService.getCustomerOrderTypes();
  // Order Status Options
  statusOptions: SelectOptions[] = this.auxiliarTableService.getOrderStatus();
  // Shipment Method
  shipmentOptions: SelectOptions[] = this.auxiliarTableService.getShipmentMethods();
  // Incoterm Options
  incotermOptions: SelectOptions[] = this.auxiliarTableService.getIncoterms();

  // Instantiate FORM data
  public formData: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private errorMessageService: ErrorMessageService,
    private auxiliarTableService: AuxiliarTableService,
    private customerOrderService: CustomerOrderService,
    private entityService: EntityService,
    private heightService: HeightService,
    private el: ElementRef,
    private renderer: Renderer2
   ) {
    // Blank Order (new)
    this.formData = this.newFormData();
  }

  ngOnInit() {

    // FORM data
    if (this.orderId != null) {
      // Read existing order
      this.customerOrderService.getCustomerOrderByOrderid(this.orderId)
        .subscribe(
          data => {
            // Set the form data with the order
            this.formData = this.editFormData(data);
          }
        );
    }

    // Get Customer Options
    this.entityService.getAllEntitiesByType('cus')
    .subscribe(
      data => {
        // Set the form data with the order
        this.customerOptions = data.map(row => row);
      }
    );
  }

  ngAfterViewInit() {
    console.log('*** FORM EL:', this.el);
    // Calculate the component height
    const componentHeight = this.heightService.setElementHeight(
      'app-root',
      ['appHeader', 'appErrorLine'],
      59,  // offsetHeight
      530  // minHeight
    );
    // Set height to mat-card TAG -> BLOCK GENERAL
    this.renderer.setStyle(this.el.nativeElement.children[0].children[0], 'height', `${componentHeight}px`);
  }

  ngAfterContentInit() {
    if (this.orderId != null) {
      this.formData.get('blkGeneral').get('customerId').disable();
      this.formData.get('blkGeneral').get('companyId').disable();
    }
  }

  // GETTERS: convenience getter for easy access to form fields
  get orderNo() { return this.formData.get('blkGeneral').get('orderNo'); }

  // Creates a empty FormGroup
  newFormData(): FormGroup {
    return this.fb.group({

      /**
          Form Properties (mode property)
          ='INSERT': the record is new and is NOT stored in the DBase
          ='QUERY':  the record has been read from the DBase but was NOT modified
          ='UPDATE': the record has been read from the DBase and WAS modified
      **/
      formProperties: {
        mode: 'INSERT'
      },

      // General BLOCK
      blkGeneral: this.fb.group({
        companyId: [1, [<any>Validators.required]],
        orderNo: ['NEW'],
        custRef: [''],
        orderType: ['P'],
        customerId: ['', [<any>Validators.required, this.validateCustomerId.bind(this)]],
        applicantName: [''],
        orderDate: [(new Date()).toJSON().substring(0, 10), [<any>Validators.required]],
        orderStatus: ['P'],
        incoterm: ['FOB'],
        shipmentMethod: ['A'],
        observations: [''],
        pieces: [0],
        eta: [''],
        deliveryDate: [''],
        thirdPartyId: ['', [<any>Validators.required]],
        eventsScope: ['G']
      }),

      // Block FROM
      blkFrom: this.fb.group({
        fromEntity: [''],
        fromAddress1: [''],
        fromAddress2: [''],
        fromCity: [''],
        fromZipcode: [''],
        fromState: [''],
        fromCountryId: ['ARG'],
        fromContact: [''],
        fromEmail: [''],
        fromTel: ['']
      }),

      // Block TO
      blkTo: this.fb.group({
        toEntity: ['', Validators.required],
        toAddress1: [''],
        toAddress2: [''],
        toCity: [''],
        toZipcode: [''],
        toState: [''],
        toCountryId: ['ARG'],
        toContact: [''],
        toEmail: [''],
        toTel: ['']
      }),

    });
  }

  // Creates a FormGroup using the data of an order
  editFormData(data: any): FormGroup {
    return this.fb.group({

      // Form Properties
      formProperties: this.fb.group({
        mode: 'QUERY'
      }),

      // General BLOCK
      blkGeneral: this.fb.group({
        companyId: [data.companyId],
        orderNo: [data.orderNo],
        orderId: [data.orderId],
        custRef: [data.custRef],
        orderType: [data.orderType],
        customerId: [data.customerId],
        applicantName: [data.applicantName],
        orderDate: [data.orderDate, Validators.required],
        orderStatus: [data.orderStatus],
        incoterm: [data.incoterm],
        shipmentMethod: [data.shipmentMethod],
        observations: [data.observations],
        pieces: [data.pieces],
        eta: [data.eta],
        deliveryDate: [data.deliveryDate],
        thirdPartyId: [data.thirdPartyId, Validators.required],
        eventsScope: [data.eventsScope]
      }),

      // Block FROM
      blkFrom: this.fb.group({
        fromEntity: [data.fromEntity],
        fromAddress1: [data.fromAddress1],
        fromAddress2: [data.fromAddress2],
        fromCity: [data.fromCity],
        fromZipcode: [data.fromZipcode],
        fromState: [data.fromState],
        fromCountryId: [data.fromCountryId],
        fromContact: [data.fromContact],
        fromEmail: [data.fromEmail],
        fromTel: [data.fromTel]
      }),

      // Block TO
      blkTo: this.fb.group({
        toEntity: [data.toEntity, Validators.required],
        toAddress1: [data.toAddress1],
        toAddress2: [data.toAddress2],
        toCity: [data.toCity],
        toZipcode: [data.toZipcode],
        toState: [data.toState],
        toCountryId: [data.toCountryId],
        toContact: [data.toContact],
        toEmail: [data.toEmail],
        toTel: [data.toTel]
      }),
    });
  }

  openDropDown(option) {
    if (option === 'from') {
      this.showFromEntityDropDown = !this.showFromEntityDropDown;
    } else {
      this.showToEntityDropDown   = !this.showToEntityDropDown;
    }
  }

  // Trigger validation for item blkGeneral.customerID
  validateCustomerId(control: FormControl): {[s: string]: boolean} {

    // Set the customer order's company based on the customer
    if (control.value !== '') {
      // Find the company Id that this customer belongs to
      this.entityService.getEntityByid(control.value)  // http.get<EntityModel>(`/api/entities/${control.value}.json`)
        .subscribe(data => {
          if (data) {
            this.formData.get('blkGeneral').get('companyId').setValue(data.companyId);
          }
        });
    }
    return null;  // null means NO errors
  }

  // Save the Order to the DBase
  saveOrder(orderId) {

    // Clear message
    this.errorMessageService.changeErrorMessage('');
    // Save order
    this.customerOrderService.updCustomerOrderById(orderId, this.formData).subscribe(
      data => {

        // Re-set the order for QUERY modality
        if (this.formData.value.formProperties.mode === 'INSERT') {
          this.formData.value.formProperties.mode = 'QUERY';
          this.formData.get('blkGeneral').get('customerId').disable();
          this.formData.get('blkGeneral').get('companyId').disable();
          this.formData.get('blkGeneral').get('orderNo').setValue(data['orderNo']);
          this.orderId = data['id'];
          // Output message
          this.errorMessageService.changeErrorMessage(
            `The new customer order #${this.orderNo.value} was created succesfuly`
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
