import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { tap, map } from 'rxjs/operators';

// External libraries
import * as moment from 'moment';

// Environment
import { environment } from '../environments/environment';

// Models
import { OrderGridModel } from '../models/order_grid.model';
import { OrderModel } from '../models/order.model';
import { OrderEventModel } from '../models/order_event.model';
import { LastEventDataModel } from 'src/models/last_event_data.model';
import { ItemModel } from 'src/models/item.model';

// Services
import { AuxiliarTableService } from './auxiliar_table.service';

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
  public newDBaseItem = new Subject<boolean>();

  // Define Options
  private shipmentMethodIcon = {
    'A': 'air',
    'S': 'ship',
    'G': 'ground'
  };
  private conditionOptions = [];
  private statusOptions = [];

  constructor(
    private auxiliarTableService: AuxiliarTableService,
    private http: HttpClient
  ) {
    this.initOptions();
  }

  private initOptions() {
    // Item Condition Options
    this.auxiliarTableService.getItemConditions().subscribe(
      data => this.conditionOptions = data
    );
    // Item Status Options
    this.auxiliarTableService.getItemStatus().subscribe(
      data => this.statusOptions = data
    );
  }

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
  public saveWarehouseReceipt(formData: FormGroup): Observable<any> {

    // Map data before sending to DBase
    const orderToSave = {
      // Block General
      companyId: formData.value.general.companyId,
      clientId: formData.value.general.clientId,
      orderNo: formData.value.general.orderNo,
      applicantName: formData.value.general.applicantName,
      clientRef: formData.value.general.clientRef,
      deliveryDatetime: formData.value.general.deliveryDatetime,
      eta: formData.value.general.eta,
      incoterm: formData.value.general.incoterm,
      legacyOrderNo: formData.value.general.legacyOrderNo,
      observations: formData.value.general.observations,
      orderDatetime: formData.value.general.orderDatetime,
      status: formData.value.general.status,
      orderType: formData.value.general.orderType,
      pieces: formData.value.general.pieces,
      shipmentMethod: formData.value.general.shipmentMethod,
      thirdPartyId: formData.value.general.thirdPartyId,
      // Block Shipper
      fromEntity: formData.value.shipper.fromEntity,
      fromAddress1: formData.value.shipper.fromAddress1,
      fromAddress2: formData.value.shipper.fromAddress2,
      fromCity: formData.value.shipper.fromCity,
      fromZipcode: formData.value.shipper.fromZipcode,
      fromState: formData.value.shipper.fromState,
      fromCountryId: formData.value.shipper.fromCountryId,
      fromContact: formData.value.shipper.fromContact,
      fromEmail: formData.value.shipper.fromEmail,
      fromTel: formData.value.shipper.fromTel,
      // Block Consignee
      toEntity: formData.value.consignee.toEntity,
      toAddress1: formData.value.consignee.toAddress1,
      toAddress2: formData.value.consignee.toAddress2,
      toCity: formData.value.consignee.toCity,
      toZipcode: formData.value.consignee.toZipcode,
      toState: formData.value.consignee.toState,
      toCountryId: formData.value.consignee.toCountryId,
      toContact: formData.value.consignee.toContact,
      toEmail: formData.value.consignee.toEmail,
      toTel: formData.value.consignee.toTel,
      // Block Ground
      groundEntity: formData.value.carrier.groundEntity,
      groundBookingNo: formData.value.carrier.groundBookingNo,
      groundDepartureCity: formData.value.carrier.groundDepartureCity,
      groundDepartureDate: formData.value.carrier.groundDepartureDate,
      groundArrivalCity: formData.value.carrier.groundArrivalCity,
      groundArrivalDate: formData.value.carrier.groundArrivalDate,
      // Block Air
      airEntity: formData.value.carrier.airEntity,
      airWaybillNo: formData.value.carrier.airWaybillNo,
      airDepartureCity: formData.value.carrier.airDepartureCity,
      airDepartureDate: formData.value.carrier.airDepartureDate,
      airArrivalCity: formData.value.carrier.airArrivalCity,
      airArrivalDate: formData.value.carrier.airArrivalDate,
      // Block Sea
      seaEntity: formData.value.carrier.seaEntity,
      seaBillLandingNo: formData.value.carrier.seaBillLandingNo,
      seaBookingNo: formData.value.carrier.seaBookingNo,
      seaContainersNo: formData.value.carrier.seaContainersNo,
      seaDepartureCity: formData.value.carrier.seaDepartureCity,
      seaDepartureDate: formData.value.carrier.seaDepartureDate,
      seaArrivalCity: formData.value.carrier.seaArrivalCity,
      seaArrivalDate: formData.value.carrier.seaArrivalDate
    };

    if (formData.get('general').get('type').value === 'WarehouseReceipt') {

      // Warehouse Receipt process
      if (formData.get('general').get('orderNo').value === 'NEW') {

        // New warehouse receipt
        return this.http.post(`${environment.envData.dataBaseServer}/api/v1/warehouse_receipts`, orderToSave);
      } else {

        // Edit warehouse receipt
        // tslint:disable-next-line: max-line-length
        return this.http.patch(`${environment.envData.dataBaseServer}/api/v1/warehouse_receipts/${formData.value.general.id}.json`, orderToSave);
      }
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
        // Refresh table
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

  /* ******************************************************************************************************
     Order ITEMS
  * ******************************************************************************************************/

  // Get all the items of an order
  public getAllOrderItems(orderId: number):  Observable<ItemModel[]> {
    return this.http.get<ItemModel[]>(
      `${environment.envData.dataBaseServer}/api/v1/orders/${(orderId == null) ? 0 : orderId}/items.json`
    ).pipe(
      map(
        data => {
          const auxArray: ItemModel[] = [];
          data.forEach((el: ItemModel) => {
            el['conditionName'] = this.conditionOptions.find(option => option.id === el.condition ).name;
            el['statusName'] = this.statusOptions.find(option => option.id === el.status ).name;
            auxArray.push(el);
          });
          return auxArray;
        }
      )
    );
  }

  // Save a new order item
  public newOrderItem(orderId: number, orderItemData: ItemModel): Observable<any> {
    return this.http.post(`${environment.envData.dataBaseServer}/api/v1/orders/${orderId}/items.json`, orderItemData).pipe(
      tap(
        data => this.newDBaseItem.next(true)
      )
    );
  }

}
