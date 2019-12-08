import { Component, OnInit, Input, AfterContentInit, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

// External libraries
import * as moment from 'moment';

// Models
import { LastEventDataModel } from '../../../../models/last_event_data.model';
import { TrackingMilestoneModel } from 'src/models/tracking_milestone.model';

// Services
import { OrderService } from '../../../../shared/order.service';
import { EventService } from '../../../../shared/event.service';

@Component({
  selector: 'app-order-form-events',
  templateUrl: './order_form_events.component.html',
  styleUrls: ['./order_form_events.component.scss']
})
export class OrderFormEventsComponent implements OnInit {

  // Input Order Form as a parameters
  @Input() formData: FormGroup;

  // Define variables
  public dataAvailable = false;
  public  trackingMilestones: Observable<TrackingMilestoneModel[]>;
  public  lastEventData: LastEventDataModel = {
    orderId: null,
    createdAt: '',
    placeOrder: 1,
    message: 'No events yet',
    shipmentMethod: 'air'
  };

  // Define subscriptions
  private subsOrderLastEvent: Subscription;   // Last order event

  constructor(
    private eventService: EventService,
    private orderService: OrderService
  ) {

    // Subscribe to last event order changes
    this.subsOrderLastEvent = this.orderService.lastOrderEvent.subscribe(
      data => {
        if (data['orderId'] !== null && data['orderId'] === this.orderId.value) {
          this.lastEventData = data;
          this.dataAvailable = true;
        } else {
          this.dataAvailable = true;
        }
      }
    );

  }

  // GETTERS
  get orderId() { return this.formData.get('general').get('id'); }
  get shipmentMethod() { return this.formData.get('general').get('shipmentMethod'); }

  ngOnInit() {
    // Get all tracking Milestones
    this.trackingMilestones = this.eventService.getAllTrackingMilestones();

    // Set last event order
    this.orderService.setLastOrderEvent(this.orderId.value);
  }

  ngDestroy() {
    this.subsOrderLastEvent.unsubscribe();
  }

}
