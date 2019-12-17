import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
// Moment.js
import * as moment from 'moment';

// Models
import { OrderGridModel } from '../../../models/order_grid.model';
import { OrderModel } from 'src/models/order.model';

// Services
import { AuthsService } from '../../../shared/auths.service';
import { OrderService } from '../../../shared/order.service';
import { ErrorMessageService } from '../../../shared/error-message.service';

@Component({
  selector: 'app-order-form-tabs',
  templateUrl: './order_form_tabs.component.html',
  styleUrls: ['./order_form_tabs.component.scss']
})
export class OrderFormTabsComponent implements OnInit {

  // Get parameter's data
  // tslint:disable-next-line: no-input-rename
  @Input('type') typeOfOrder: string;  // WarehouseReceipt or Shipment
  @Input() orderData: OrderGridModel;

  // Define variables
  public formData: FormGroup;
  public dataAvailable = false;

  constructor(
    private authsService: AuthsService,
    private orderService: OrderService,
    private errorMessageService: ErrorMessageService,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {

    // Initialize Order Form
    if (this.orderData) {
      // Get an existing order
      this.orderService.getOrderById(this.orderData.id).subscribe(
        data => {
          this.formData = this.setFormData(data);
          this.dataAvailable = true;
        },
        err => {
          this.errorMessageService.changeErrorMessage(err);
        }
      );
    } else {
      // Set a new order
      this.formData = this.newFormData(this.typeOfOrder);
      this.dataAvailable = true;
    }
  }

  // GETTERS
  get orderNo() { return this.formData.get('general').get('orderNo'); }
  get type() { return this.formData.get('general').get('type'); }
  get thirdPartyId() { return this.formData.get('general').get('thirdPartyId'); }

  // Creates a empty Order Form
  private newFormData(type: string): FormGroup {
    return this.fb.group({
      /*
       * Form Properties (mode property)
       * ='INSERT': the record is new and is NOT stored in the DBase
       * ='QUERY':  the record has been read from the DBase but was NOT modified
       * ='UPDATE': the record has been read from the DBase and WAS modified
      **/
      formProperties: {
        mode: 'INSERT'
      },

      // General block
      general: this.fb.group({
        id: [null],
        companyId: [this.authsService.getAllowCompanies()[0]],
        clientId: [null],
        orderNo: ['NEW'],
        type: [type],
        applicantName: [''],
        cancelDatetime: [''],
        cancelUser: [''],
        clientRef: [''],
        deliveryDatetime: [{value: '', disabled: true}],
        eta: [''],
        incoterm: ['   '],
        legacyOrderNo: [{value: '', disabled: true}],
        observations: [''],
        orderDatetime: [{
          value: moment(),
          disabled: true
        }],
        orderStatus: ['P'],
        orderType: ['P'],
        pieces: [0],
        shipmentMethod: ['A'],
        thirdPartyId: [''],
      }),

      // SHIPPER block
      shipper: this.fb.group({
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

      // CONSIGNEE block
      consignee: this.fb.group({
        toEntity: [''],
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

      // CARRIER block
      carrier: this.fb.group({
        // GROUND
        groundEntity: [''],
        groundBookingNo: [''],
        groundDepartureCity: [''],
        groundDepartureDate: [''],
        groundArrivalCity: [''],
        groundArrivalDate: [''],
        // AIR
        airEntity: [''],
        airWaybillNo: [''],
        airDepartureCity: [''],
        airDepartureDate: [''],
        airArrivalCity: [''],
        airArrivalDate: [''],
        // SEA
        seaEntity: [''],
        seaBillLandingNo: [''],
        seaBookingNo: [''],
        seaContainersNo: [''],
        seaWaybillNo: [''],
        seaDepartureCity: [''],
        seaDepartureDate: [''],
        seaArrivalCity: [''],
        seaArrivalDate: [''],
      })

    });
  }

  // Sets Order Form by data
  private setFormData(data: OrderModel): FormGroup {
    return this.fb.group({
      /*
       * Form Properties (mode property)
       * ='INSERT': the record is new and is NOT stored in the DBase
       * ='QUERY':  the record has been read from the DBase but was NOT modified
       * ='UPDATE': the record has been read from the DBase and WAS modified
      **/
      formProperties: {
        mode: 'QUERY'
      },

      // General block
      general: this.fb.group({
        id: [data.id],
        companyId: [{
          value: data.companyId,
          disabled: true
        }],
        clientId: [{
          value: data.clientId,
          disabled: true
        }],
        orderNo: [data.orderNo],
        type: [data.type],
        applicantName: [data.applicantName],
        cancelDatetime: [data.cancelDatetime],
        cancelUser: [data.cancelUser],
        clientRef: [data.clientRef],
        deliveryDatetime: [{
          value: data.deliveryDatetime === null ? '' : data.deliveryDatetime,
          disabled: true
        }],
        eta: [data.eta === null ? '' : data.eta],
        incoterm: [data.incoterm],
        legacyOrderNo: [{
          value: data.legacyOrderNo,
          disabled: true
        }],
        observations: [data.observations],
        orderDatetime: [{
          value: data.orderDatetime,
          disabled: true
        }],
        orderStatus: [data.orderStatus],
        orderType: [data.orderType],
        pieces: [data.pieces],
        shipmentMethod: [data.shipmentMethod],
        thirdPartyId: [data.thirdPartyId]
      }),

      // SHIPPER block
      shipper: this.fb.group({
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

      // CONSIGNEE block
      consignee: this.fb.group({
        toEntity: [data.toEntity],
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

      // CARRIER block
      carrier: this.fb.group({
        // GROUND
        groundEntity: [data.groundEntity],
        groundBookingNo: [data.groundBookingNo],
        groundDepartureCity: [data.groundDepartureCity],
        groundDepartureDate: [data.groundDepartureDate],
        groundArrivalCity: [data.groundArrivalCity],
        groundArrivalDate: [data.groundArrivalDate],
        // AIR
        airEntity: [data.airEntity],
        airWaybillNo: [data.airWaybillNo],
        airDepartureCity: [data.airDepartureCity],
        airDepartureDate: [data.airDepartureDate],
        airArrivalCity: [data.airArrivalCity],
        airArrivalDate: [data.airArrivalDate],
        // SEA
        seaEntity: [data.seaEntity],
        seaBillLandingNo: [data.seaBillLandingNo],
        seaBookingNo: [data.seaBookingNo],
        seaContainersNo: [data.seaContainersNo],
        seaWaybillNo: [data.seaWaybillNo],
        seaDepartureCity: [data.seaDepartureCity],
        seaDepartureDate: [data.seaDepartureDate],
        seaArrivalCity: [data.seaArrivalCity],
        seaArrivalDate: [data.seaArrivalDate]
      })

    });
  }

  // Save the Order to the DBase
  public saveOrder() {

    // Clear message
    this.errorMessageService.changeErrorMessage('');
    console.log('*** save fromData:', this.formData);

    // Check form validity
    if (this.formData.invalid) {
      this.errorMessageService.changeErrorMessage('TRK-0002(E): the form is invalid. Please check required fields and retry.');
    } else {
      // WarehouseReceipt
      if (this.type.value === 'WarehouseReceipt') {

        this.orderService.saveWarehouseReceipt(this.formData).subscribe(
          data => {
            this.errorMessageService.changeErrorMessage(data.message);
          },
          err => {
            this.errorMessageService.changeErrorMessage(err);
          }
        );

        // Shipment
      } else {
        console.log('*** PASO 99');
      }
    }
  }

}

