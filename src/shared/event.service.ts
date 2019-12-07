import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Environment
import { environment } from '../environments/environment';

// Class Models
import { EventModel } from '../models/event.model';
import { TrackingMilestoneModel } from '../models/tracking_milestone.model';

@Injectable()
export class EventService {

  data: any;

  constructor(
    private http: HttpClient
  ) { }

  // Get all event types
  public getAllEvents(): Observable<EventModel[]> {
    return this.http.get<EventModel[]>(
      `${environment.envData.loginServer}/api/v1/events.json`
    );
  }

  // Get all tracking milestones
  public getAllTrackingMilestones(): Observable<TrackingMilestoneModel[]> {
    return this.http.get<TrackingMilestoneModel[]>(
      `${environment.envData.loginServer}/api/v1/tracking_milestones.json`
    );
  }



}
