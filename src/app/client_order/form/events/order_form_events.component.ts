import { Component, OnInit, Input, AfterContentInit, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

// Models
import { LastEventDataModel } from '../../../../models/last_event_data.model';
import { TrackingMilestoneModel } from 'src/models/tracking_milestone.model';

// Services
import { OrderService } from '../../../../shared/order.service';
import { EventService } from '../../../../shared/event.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
  public trackingMilestones: Observable<TrackingMilestoneModel[]>;
  public lastEventData: LastEventDataModel = {
    orderId: null,
    createdAt: '',
    placeOrder: 1,
    message: 'No events yet',
    observations: 'No info',
    shipmentMethod: 'air',
    trackingMilestoneName: '',
    scope: 'private'
  };
  // Define variables for order on-hold or Stopped
  public orderHoldOrStop = false;
  public orderStateClass = '';
  public orderStateMessage = '';

  // Define subscriptions
  private subsOrderLastEvent: Subscription;   // Last order event

  constructor(
    private eventService: EventService,
    private orderService: OrderService
  ) {

    // Subscribe to last event order changes
    this.subsOrderLastEvent = this.orderService.lastOrderEventPrivate.subscribe(
      data => {
        if (data['orderId'] !== null && data['orderId'] === this.orderId.value) {
          this.lastEventData = data;
          this.dataAvailable = true;
          // Check for Order On-Hold or Stopped
          if (this.lastEventData.placeOrder === 0) {
            this.orderHoldOrStop = true;
            this.orderStateMessage = this.lastEventData.trackingMilestoneName;
            if (this.orderStateMessage.toUpperCase().indexOf('STOP') >= 0) {
              this.orderStateClass = 'STOP';
            } else {
              this.orderStateClass = 'HOLD';
            }
          } else {
            this.orderHoldOrStop = false;
          }
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
    this.orderService.setLastOrderEvent(this.orderId.value, 'private');
  }

  ngDestroy() {
    this.subsOrderLastEvent.unsubscribe();
  }

}
