import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';

// Environment
import { environment } from '../environments/environment';

// Class Models
import { OrderGridModel } from '../models/order_grid.model';


@Injectable()
export class OrderService {

  // Obtain the Client Order Id to create a new Tab
  // This is used in client_order_tabs.component.ts
  private orderIdTab = new BehaviorSubject(0);
  orderTab = this.orderIdTab.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  // Emit a new client order Id to create a new tab
  addClientOrderTab(orderId: number) {
    this.orderIdTab.next(orderId);
  }

  // Get all orders for Grid format
  getOrdersGrid():  Observable<OrderGridModel[]> {
    return this.http.get<OrderGridModel[]>(
      `${environment.envData.dataBaseServer}/api/v1/orders/grid.json`
    );
  }

  // Get one client order by orderId
  getClientOrderByOrderid(orderId: number):  Observable<OrderGridModel> {
    return this.http.get<OrderGridModel>(
      `${environment.envData.dataBaseServer}/api/v1/client_orders/${(orderId == null) ? 0 : orderId}.json`
    );
  }

  // Update a client order by Id
  updClientOrderById(orderId: number, formData: FormGroup): Observable<any> {

    // Save form data
    const vformData = formData.value;
    // Map data before send
    const clientOrder = {
      // Order data
      companyId:     vformData.blkGeneral.companyId,
      clientId:    vformData.blkGeneral.clientId,
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
      // Add the new client order in the DBase
      return this.http.post(`${environment.envData.dataBaseServer}/api/v1/client_orders.json`, clientOrder);

    } else {

      /*
          UPDATE a existing Order to the DBase
      */
      // Add the new client order in the DBase
      return this.http.patch(`${environment.envData.dataBaseServer}/api/v1/client_orders/${orderId}.json`, clientOrder);
    }

  }

}
