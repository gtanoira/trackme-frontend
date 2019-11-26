import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTabGroup, MatTab } from '@angular/material';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Models
import { OrderTabIdModel } from '../../../models/order_tab_id.model';

// Services
import { AuthsService } from '../../../shared/auths.service';
import { ErrorMessageService } from '../../../shared/error-message.service';
import { WarehouseReceiptService } from '../../../shared/warehouse_receipt.service';

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

  constructor(
    private authsService: AuthsService,
    private errorMessageService: ErrorMessageService,
    private fb: FormBuilder,
    private warehouseReceiptService: WarehouseReceiptService
  ) {}

  ngOnInit() {
    // Initialize Order Form
    if (this.orderData) {
      this.formData = this.getOrderData();
    } else {
      this.formData = this.newFormData();
    }
  }

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
        id: [0],
        companyId: [this.authsService.getAllowCompanies()[0]],
        clientId: [0, [this.validateClientId.bind(this)]],
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

}

