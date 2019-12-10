import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';

// External libraries
import * as moment from 'moment';

// Environment
import { environment } from '../environments/environment';

// Models
import { OrderGridModel } from '../models/order_grid.model';
import { OrderModel } from '../models/order.model';
import { OrderEventModel } from '../models/order_event.model';
import { LastEventDataModel } from 'src/models/last_event_data.model';
import { tap } from 'rxjs/operators';

@Injectable()
export class OrderService {

  // Obtain the order Id to create a new Tab
  // This is used in order_tabs.component.ts
  private orderIdTab = new BehaviorSubject<OrderGridModel>(null);
  public  orderTab = this.orderIdTab.asObservable();

  // Define Subjects to LastEvent of an order
  public lastOrderEventPrivate = new Subject<LastEventDataModel>();
  public lastOrderEventPublic = new Subject<LastEventDataModel>();
  // Define Subject for new order event
  public newDBaseEvent = new Subject<boolean>();

  // Define variables
  private shipmentMethodIcon = {
    'A': 'air',
    'S': 'ship',
    'G': 'ground'
  };

  constructor(
    private http: HttpClient
  ) { }

  // Edit a order and place it in a new tab
  public editOrder(orderData: OrderGridModel) {
    // This next() send the orderData to the order_tabs.component and creates a new tab
    this.orderIdTab.next(orderData);
  }

  // Get all orders to Grid format
  public getOrdersGrid():  Observable<OrderGridModel[]> {
    return this.http.get<OrderGridModel[]>(
      `${environment.envData.dataBaseServer}/api/v1/orders/grid.json`
    );
  }

  // Get one order by orderId
  public getOrderById(orderId: number):  Observable<OrderModel> {
    return this.http.get<OrderModel>(
      `${environment.envData.dataBaseServer}/api/v1/orders/${(orderId == null) ? 0 : orderId}.json`
    );
  }

  // Update a client order by Id
  public updClientOrderById(orderId: number, formData: FormGroup): Observable<any> {

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

  /* ******************************************************************************************************
     Order EVENTS
  * ******************************************************************************************************/

  // Get ALL the events of an order
  public getAllOrderEvents(orderId: number):  Observable<OrderEventModel[]> {
    return this.http.get<OrderEventModel[]>(
      `${environment.envData.dataBaseServer}/api/v1/orders/${(orderId == null) ? 0 : orderId}/order_events.json`
    );
  }

  // Add a event to a Customer Order
  public addEventToOrder(orderId: number, orderEvent: OrderEventModel) {

    // Add the new event in the DBase
    return this.http.post(`${environment.envData.dataBaseServer}/api/v1/orders/${orderId}/events.json`, orderEvent);
  }

  // Save a new order event
  public newOrderEvent(orderId: number, orderEventData: object): Observable<any> {
    return this.http.post(`${environment.envData.dataBaseServer}/api/v1/orders/${orderId}/order_events.json`, orderEventData).pipe(
      tap(
        data => this.newDBaseEvent.next(true)
      )
    );
  }

  // Set lastOrderEvent subject
  public setLastOrderEvent(orderId: number, scope?: string | 'private'): void {

    // Empty last order event
    const emptyEvent: LastEventDataModel = {
      orderId: null,
      createdAt: '',
      placeOrder: 1,
      message: 'No events yet',
      observations: 'No info',
      shipmentMethod: this.shipmentMethodIcon['A'],
      trackingMilestoneName: '',
      scope: 'private'
    };

    this.http.get<LastEventDataModel>(
      `${environment.envData.dataBaseServer}/api/v1/orders/${(orderId == null) ? 0 : orderId}/order_events/last_event/${scope}.json`
    ).subscribe(
      data => {
        if (data) {

          // Save the data
          const lastEvent: LastEventDataModel = data;
          // Modify some key values
          lastEvent['createdAt'] = data['createdAt'] === null ? '' : moment(data['createdAt']).format('DD-MMM-YYYY');
          lastEvent['observations'] = data['observations'] === '' ? 'No info' : data['observations'];
          lastEvent['shipmentMethod'] = this.shipmentMethodIcon[data['shipmentMethod']];

          // Save private scope
          this.lastOrderEventPrivate.next(lastEvent);
          // Save public scope
          if (scope === 'public') {
            this.lastOrderEventPublic.next(lastEvent);
          }

        } else {

          // Save private scope
          this.lastOrderEventPrivate.next(emptyEvent);
          // Save public scope
          if (scope === 'public') {
            this.lastOrderEventPublic.next(emptyEvent);
          }

        }
      },
      err => {

        // Save private scope
        this.lastOrderEventPrivate.next(emptyEvent);
        // Save public scope
        if (scope === 'public') {
          this.lastOrderEventPublic.next(emptyEvent);
        }

      }
    );
  }

}
