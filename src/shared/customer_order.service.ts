import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

// Environment
import { environment } from '../environments/environment';

// Class Models
import { CustomerOrderModel } from '../models/customer_order.model';
import { FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';

@Injectable()
export class CustomerOrderService {

  // Obtain the Customer Order Id to create a new Tab
  // This is used in customer_order_tabs.component.ts
  private cOrderIdTab = new BehaviorSubject(0);
  cOrderTab = this.cOrderIdTab.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  // Emit a new customer order Id to create a new tab
  addCustomerOrderTab(orderId: number) {
    this.cOrderIdTab.next(orderId);
  }

  // Get all customer orders
  getAllCustomerOrders():  Observable<CustomerOrderModel[]> {
    return this.http.get<CustomerOrderModel[]>(
      `${environment.envData.dataBaseServer}/api/v1/customer_orders.json`
    );
  }

  // Get one customer order by orderId
  getCustomerOrderByOrderid(orderId: number):  Observable<CustomerOrderModel> {
    return this.http.get<CustomerOrderModel>(
      `${environment.envData.dataBaseServer}/api/v1/customer_orders/${(orderId == null) ? 0 : orderId}.json`
    );
  }

  // Update a customer order by Id
  updCustomerOrderById(orderId: number, formData: FormGroup): Observable<any> {

    // Save form data
    const vformData = formData.value;
    // Map data before send
    const customerOrder = {
      // Order data
      companyId:     vformData.blkGeneral.companyId,
      customerId:    vformData.blkGeneral.customerId,
      orderNo:       vformData.blkGeneral.orderNo,
      orderStatus:   vformData.blkGeneral.orderStatus,
      oldOrderNo:    vformData.blkGeneral.oldOrderNo,
      // Block General
      orderDate:     vformData.blkGeneral.orderDate,
      custRef:       vformData.blkGeneral.custRef,
      orderType:     vformData.blkGeneral.orderType,
      applicantName: vformData.blkGeneral.applicantName,
      incoterm:      vformData.blkGeneral.incoterm,
      shipmentMethod: vformData.blkGeneral.shipmentMethod,
      // Events
      eventsScope:   vformData.blkGeneral.eventsScope,
      // Other
      eta:           vformData.blkGeneral.eta,
      deliveryDate:  vformData.blkGeneral.deliveryDate,
      thirdPartyId:  vformData.blkGeneral.thirdPartyId,
      // Observations
      observations:  vformData.blkGeneral.observations,
      pieces:        vformData.blkGeneral.pieces,
      // Block From
      fromEntity:    vformData.blkFrom.fromEntity,
      fromAddress1:  vformData.blkFrom.fromAddress1,
      fromAddress2:  vformData.blkFrom.fromAddress2,
      fromCity:      vformData.blkFrom.fromCity,
      fromZipcode:   vformData.blkFrom.fromZipcode,
      fromState:     vformData.blkFrom.fromState,
      fromCountryId: vformData.blkFrom.fromCountryId,
      fromContact:   vformData.blkFrom.fromContact,
      fromEmail:     vformData.blkFrom.fromEmail,
      fromTel:       vformData.blkFrom.fromTel,
      // Block To
      toEntity:      vformData.blkTo.toEntity,
      toAddress1:    vformData.blkTo.toAddress1,
      toAddress2:    vformData.blkTo.toAddress2,
      toCity:        vformData.blkTo.toCity,
      toZipcode:     vformData.blkTo.toZipcode,
      toState:       vformData.blkTo.toState,
      toCountryId:   vformData.blkTo.toCountryId,
      toContact:     vformData.blkFrom.toContact,
      toEmail:       vformData.blkFrom.toEmail,
      toTel:         vformData.blkFrom.toTel
    };

    if (vformData.formProperties.mode === 'INSERT') {

      /*
          INSERT new Order into the DBase
      */
      // Add the new customer order in the DBase
      return this.http.post(`${environment.envData.dataBaseServer}/api/v1/customer_orders.json`, customerOrder);

    } else {

      /*
          UPDATE a existing Order to the DBase
      */
      // Add the new customer order in the DBase
      return this.http.patch(`${environment.envData.dataBaseServer}/api/v1/customer_orders/${orderId}.json`, customerOrder);
    }

  }

}
