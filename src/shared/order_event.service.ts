import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Environment
import { environment } from '../environments/environment';

// Models
import { EventModel } from '../models/event.model';

@Injectable()
export class OrderEventService {

  data: any;

  constructor(
    private http: HttpClient
  ) {}

  // Get ALL the events of a customer order
  getEventsFromCustomerOrder(customerOrderId: number):  Observable<EventModel[]> {
    return this.http.get<EventModel[]>(
      `${environment.envData.dataBaseServer}/api/v1/customer_orders/${(customerOrderId == null) ? 0 : customerOrderId}/events.json`
    );
  }

  // Add a event to a Customer Order
  addEventToCustomerOrder(orderId: number, customerOrderEvent: EventModel) {

    // Add the new event in the DBase
    return this.http.post(`${environment.envData.dataBaseServer}/api/v1/customer_orders/${orderId}/events.json`, customerOrderEvent);
  }
}
