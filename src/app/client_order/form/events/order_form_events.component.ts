import { Component, OnInit, Input, AfterContentInit, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

// External libraries
import * as moment from 'moment';

// Models
import { OrderEventModel } from '../../../../models/order_event.model';
import { TrackingMilestoneModel } from 'src/models/tracking_milestone.model';

// Services
import { OrderService } from '../../../../shared/order.service';
import { EventService } from '../../../../shared/event.service';

// Interfaces
interface LastEventData {
  createdAt: string;
  placeOrder: number;
  message: string;
  shipmentMethod: string;
}

@Component({
  selector: 'app-order-form-events',
  templateUrl: './order_form_events.component.html',
  styleUrls: ['./order_form_events.component.scss']
})
export class OrderFormEventsComponent implements OnInit {

  // Input Order Form as a parameters
  @Input() formData: FormGroup;

  // Define variables
  public  trackingMilestones: Observable<TrackingMilestoneModel[]>;
  private orderEvents: OrderEventModel[];
  public  lastEventData: LastEventData;
  private shipmentMethodIcon = {
    'A': 'air',
    'S': 'ship',
    'G': 'ground'
  };

  constructor(
    private eventService: EventService,
    private orderService: OrderService
  ) {}

  // GETTERS
  get orderId() { return this.formData.get('general').get('id'); }
  get shipmentMethod() { return this.formData.get('general').get('shipmentMethod'); }

  ngOnInit() {
    // Get all tracking Milestones
    this.trackingMilestones = this.eventService.getAllTrackingMilestones();

    // Get all events of the order
    this.orderService.getAllOrderEvents(this.orderId.value).subscribe(
      data => {
        if (data) {
          this.orderEvents = data;
          this.lastEventData = {
            createdAt: moment(this.orderEvents[0]['createdAt']).format('DD-MMM-YYYY'),
            placeOrder: this.orderEvents[0]['placeOrder'],
            message: this.orderEvents[0]['eventName'],
            shipmentMethod: this.shipmentMethodIcon[this.shipmentMethod.value]
          };
        }
      },
      err => {
        this.orderEvents = [];
      }
    );
  }

}
