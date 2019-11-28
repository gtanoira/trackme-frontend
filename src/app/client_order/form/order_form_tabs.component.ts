import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

// Models
import { OrderTabIdModel } from '../../../models/order_tab_id.model';
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

  // Get parameter's0 data
  @Input() orderData: OrderTabIdModel;

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
      this.formData = this.newFormData();
      this.dataAvailable = true;
    }
  }

  // GETTERS
  get orderNo() { return this.formData.get('general').get('orderNo'); }

  // Creates a empty Order Form
  private newFormData(): FormGroup {
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
        type: ['Shipment'],
        applicantName: [''],
        cancelDatetime: [''],
        cancelUser: [''],
        clientRef: [''],
        deliveryDate: [''],
        eta: [''],
        incoterm: ['FOB'],
        legacyOrderNo: [''],
        observations: [''],
        orderDatetime: [(new Date())],
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
        companyId: [data.companyId],
        clientId: [data.clientId],
        orderNo: [data.orderNo],
        type: [data.type],
        applicantName: [data.applicantName],
        cancelDatetime: [data.cancelDatetime],
        cancelUser: [data.cancelUser],
        clientRef: [data.clientRef],
        deliveryDate: [data.deliveryDate],
        eta: [data.eta],
        incoterm: [data.incoterm],
        legacyOrderNo: [data.legacyOrderNo],
        observations: [data.observations],
        orderDatetime: [data.orderDatetime],
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

}

