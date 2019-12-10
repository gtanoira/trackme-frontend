import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

// Services
import { AuxiliarTableService } from '../../../../../shared/auxiliar_table.service';
import { AuthsService } from '../../../../../shared/auths.service';
import { OrderService } from '../../../../../shared/order.service';
import { ErrorMessageService } from '../../../../../shared/error-message.service';
import { EventService } from '../../../../../shared/event.service';

// Models
import { EventModel } from '../../../../../models/event.model';
import { LastEventDataModel } from 'src/models/last_event_data.model';
import { SelectOptions } from '../../../../../models/select_options';

interface EventOption {
  id: number;
  name: string;
}

interface TrackingMilestoneGroup {
  disabled?: boolean | false;
  name: string;
  events: EventOption[];
}

@Component({
  selector: 'app-order-event-add',
  templateUrl: './order_event_add.component.html',
  styleUrls: ['./order_event_add.component.scss']
})
export class OrderEventAddComponent implements OnInit {

  // Input parameters
  @Input() orderId: number;

  // Define variables
  public orderEventForm: FormGroup;
  private events: EventModel[] = [];

  // Select options
  public trackingMilestonesGroup: TrackingMilestoneGroup[] = [];
  public scopeOptions: Observable<SelectOptions[]>;

  constructor(
    private authsService: AuthsService,
    private auxiliarTableService: AuxiliarTableService,
    private eventService: EventService,
    private errorMessageService: ErrorMessageService,
    private fb: FormBuilder,
    private orderService: OrderService
  ) {
    // Define form
    this.orderEventForm = this.fb.group({
      eventId: ['', this.validateEventId.bind(this)],
      userId: [this.authsService.currentUserValue.id],
      orderId: [this.orderId],
      scope: ['private'],
      observations: ['']
    });
  }

  // GETTERS
  get eventId() { return this.orderEventForm.get('eventId'); }
  get userId() { return this.orderEventForm.get('userId'); }
  get scope() { return this.orderEventForm.get('scope'); }
  get observations() { return this.orderEventForm.get('observations'); }

  ngOnInit() {

    // Get Events Options
    this.eventService.getAllEvents().subscribe(
      data => {

        // Save all the events
        this.events = data;

        // Initialize variables
        this.trackingMilestonesGroup = [];
        let antGroup: string;
        let i = -1;

        if (data) {

          for (const group of data) {

            // Corte de control
            if (!antGroup || antGroup !== group.trackingMilestoneName) {
              this.trackingMilestonesGroup.push(
                {
                  disabled: false,
                  name: group.trackingMilestoneName,
                  events: []
                }
              );
              // Initialize variables
              antGroup = group.trackingMilestoneName;
              i += 1;
            }

            // Add event to the tracking milestone group
            this.trackingMilestonesGroup[i].events.push(
              {
                id: group.id,
                name: group.name
              }
            );
          }  // end for
        }
      },
      err => {
        this.trackingMilestonesGroup = [];
      }
    );

    // Get Scope Options
    this.scopeOptions = this.auxiliarTableService.getScopeOptions();

  }

  // Validator for event
  validateEventId(control: FormControl): {[s: string]: boolean} {

    if (control.value) {
      // Set the scope
      this.scope.setValue(this.events.find(el => el.id === control.value).scope);
    }
    return null;  // null means NO errors
  }

  // Save a new event
  public newOrderEvent() {

    if (!this.orderId) {
      this.errorMessageService.changeErrorMessage('TRK-0003(I): the order must be saved prior to this action');

    } else {
      const orderEventData = {
        'eventId': this.eventId.value,
        'userId': this.userId.value,
        'scope': this.scope.value,
        'observations': this.observations.value
      };

      this.orderService.newOrderEvent(this.orderId, orderEventData).subscribe(
        data => {
          this.errorMessageService.changeErrorMessage(data['message']);
          // Render the Tracking Status Bar on Screen
          this.orderService.setLastOrderEvent(this.orderId, this.scope.value);
        },
        err => {
          this.errorMessageService.changeErrorMessage(err);
        }
      );
    }
  }

}
